-- ─────────────────────────────────────────────────────────────────────────────
-- SheetPilot Core Schema (based on your notebook)
-- ─────────────────────────────────────────────────────────────────────────────

-- UUID generator (use gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Optional: case-insensitive email uniqueness (uncomment to use citext)
-- CREATE EXTENSION IF NOT EXISTS citext;

-- Common trigger to maintain updated_on
CREATE OR REPLACE FUNCTION sp_set_updated_on()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_on := NOW();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────────────────────
-- sp_users
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sp_users (
  user_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,                         -- or CITEXT if you enabled the extension
  password    TEXT,                                -- store hash here
  auth_type   TEXT NOT NULL DEFAULT 'local'                  -- 'local','google','github',...
               CHECK (auth_type IN ('local','google','github','oauth')),
  is_pro      BOOLEAN NOT NULL DEFAULT FALSE,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_on  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_on  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS trg_sp_users_updated ON sp_users;
CREATE TRIGGER trg_sp_users_updated
BEFORE UPDATE ON sp_users
FOR EACH ROW EXECUTE FUNCTION sp_set_updated_on();

-- ─────────────────────────────────────────────────────────────────────────────
-- sp_tables  (catalog of logical user tables you manage)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sp_tables (
  table_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name  TEXT NOT NULL,                                -- display/key name user chose
  user_id     UUID NOT NULL REFERENCES sp_users(user_id) ON DELETE CASCADE,
  info        JSONB NOT NULL DEFAULT '{}'::jsonb,           -- any extra metadata you want to store
  created_on  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_on  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, table_name)                              -- name unique per user
);
DROP TRIGGER IF EXISTS trg_sp_tables_updated ON sp_tables;
CREATE TRIGGER trg_sp_tables_updated
BEFORE UPDATE ON sp_tables
FOR EACH ROW EXECUTE FUNCTION sp_set_updated_on();

CREATE INDEX IF NOT EXISTS idx_sp_tables_user ON sp_tables(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- sp_views (native SQL view names or logical view entries)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sp_views (
  view_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  view_name   TEXT NOT NULL,                                -- DB identifier or logical name
  user_id     UUID NOT NULL REFERENCES sp_users(user_id) ON DELETE CASCADE,
  info        JSONB NOT NULL DEFAULT '{}'::jsonb,           -- description, tags, etc.
  created_on  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_on  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, view_name)
);
DROP TRIGGER IF EXISTS trg_sp_views_updated ON sp_views;
CREATE TRIGGER trg_sp_views_updated
BEFORE UPDATE ON sp_views
FOR EACH ROW EXECUTE FUNCTION sp_set_updated_on();

CREATE INDEX IF NOT EXISTS idx_sp_views_user ON sp_views(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- sp_reports
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE sp_report_format AS ENUM ('table','csv','pdf');

CREATE TABLE IF NOT EXISTS sp_reports (
  report_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_name TEXT NOT NULL,
  user_id     UUID NOT NULL REFERENCES sp_users(user_id) ON DELETE CASCADE,
  format      sp_report_format NOT NULL DEFAULT 'table',
  info        JSONB NOT NULL DEFAULT '{}'::jsonb,           -- columns, template, params, etc.
  created_on  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_on  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, report_name)
);
DROP TRIGGER IF EXISTS trg_sp_reports_updated ON sp_reports;
CREATE TRIGGER trg_sp_reports_updated
BEFORE UPDATE ON sp_reports
FOR EACH ROW EXECUTE FUNCTION sp_set_updated_on();

CREATE INDEX IF NOT EXISTS idx_sp_reports_user ON sp_reports(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- sp_charts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE sp_chart_type AS ENUM ('bar','line','pie','area','scatter','table');

CREATE TABLE IF NOT EXISTS sp_charts (
  chart_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_name  TEXT NOT NULL,
  user_id     UUID NOT NULL REFERENCES sp_users(user_id) ON DELETE CASCADE,
  chart_type  sp_chart_type NOT NULL DEFAULT 'bar',
  config      JSONB NOT NULL DEFAULT '{}'::jsonb,           -- x/y/series/agg/etc.
  created_on  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_on  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, chart_name)
);
DROP TRIGGER IF EXISTS trg_sp_charts_updated ON sp_charts;
CREATE TRIGGER trg_sp_charts_updated
BEFORE UPDATE ON sp_charts
FOR EACH ROW EXECUTE FUNCTION sp_set_updated_on();

CREATE INDEX IF NOT EXISTS idx_sp_charts_user ON sp_charts(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- sp_activity_log  (simple audit trail)
-- ─────────────────────────────────────────────────────────────────────────────
-- You sketched: id, action, table_name, field, old_value, new_value, created_on
-- Add optional user_id to track who did it; all values as TEXT/JSONB for flexibility.
CREATE TABLE IF NOT EXISTS sp_activity_log (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID REFERENCES sp_users(user_id) ON DELETE SET NULL,
  action      TEXT NOT NULL,                                 -- 'create','update','delete','run', etc.
  table_name  TEXT NOT NULL,                                 -- which logical table this pertains to
  field       TEXT,                                          -- which column/field changed (optional)
  old_value   TEXT,
  new_value   TEXT,
  meta        JSONB NOT NULL DEFAULT '{}'::jsonb,            -- any extra context
  created_on  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sp_activity_user   ON sp_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_sp_activity_table  ON sp_activity_log(table_name);
CREATE INDEX IF NOT EXISTS idx_sp_activity_action ON sp_activity_log(action);
