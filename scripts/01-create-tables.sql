-- Create tables for the medicine stock management system with NFC tracking

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  facility_type VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  region VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medicine Categories Table
CREATE TABLE IF NOT EXISTS medicine_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medicines Table
CREATE TABLE IF NOT EXISTS medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  generic_name VARCHAR(255),
  code VARCHAR(50) UNIQUE,
  nappi_code BIGINT,
  who_atc_code VARCHAR(50),
  atc_name VARCHAR(255),
  dosage_form VARCHAR(100),
  category_id UUID REFERENCES medicine_categories(id),
  unit_price DECIMAL(10, 2),
  schedule VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stock Batches Table
CREATE TABLE IF NOT EXISTS stock_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  batch_number VARCHAR(100) NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  manufacturing_date DATE,
  expiry_date DATE,
  quantity_received INTEGER,
  quantity_current INTEGER,
  unit VARCHAR(50),
  location VARCHAR(255),
  temperature DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- NFC Tags Table
CREATE TABLE IF NOT EXISTS nfc_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tag_id VARCHAR(100) NOT NULL UNIQUE,
  nfc_code VARCHAR(255) NOT NULL UNIQUE,
  batch_id UUID NOT NULL REFERENCES stock_batches(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  scanned BOOLEAN DEFAULT FALSE,
  last_scanned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- NFC Scan History Table
CREATE TABLE IF NOT EXISTS nfc_scan_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nfc_tag_id UUID NOT NULL REFERENCES nfc_tags(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES stock_batches(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  location VARCHAR(255),
  temperature DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  scan_status VARCHAR(50),
  notes TEXT,
  scanned_by VARCHAR(255),
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stock Movements Table
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES stock_batches(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  from_facility_id UUID REFERENCES facilities(id),
  to_facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  movement_type VARCHAR(50),
  reference_number VARCHAR(100),
  initiated_by VARCHAR(255),
  received_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  received_at TIMESTAMP WITH TIME ZONE
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicine_id UUID REFERENCES medicines(id),
  batch_id UUID REFERENCES stock_batches(id),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium',
  message TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category_id);
CREATE INDEX IF NOT EXISTS idx_medicines_status ON medicines(status);
CREATE INDEX IF NOT EXISTS idx_batches_medicine ON stock_batches(medicine_id);
CREATE INDEX IF NOT EXISTS idx_batches_facility ON stock_batches(facility_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON stock_batches(status);
CREATE INDEX IF NOT EXISTS idx_batches_expiry ON stock_batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_nfc_code ON nfc_tags(nfc_code);
CREATE INDEX IF NOT EXISTS idx_nfc_tag_id ON nfc_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_nfc_batch ON nfc_tags(batch_id);
CREATE INDEX IF NOT EXISTS idx_scan_tag ON nfc_scan_history(nfc_tag_id);
CREATE INDEX IF NOT EXISTS idx_scan_time ON nfc_scan_history(scanned_at);
CREATE INDEX IF NOT EXISTS idx_movement_batch ON stock_movements(batch_id);
CREATE INDEX IF NOT EXISTS idx_movement_from ON stock_movements(from_facility_id);
CREATE INDEX IF NOT EXISTS idx_movement_to ON stock_movements(to_facility_id);
CREATE INDEX IF NOT EXISTS idx_alert_facility ON alerts(facility_id);
CREATE INDEX IF NOT EXISTS idx_alert_resolved ON alerts(is_resolved);
