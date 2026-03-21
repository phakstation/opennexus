-- Create tables for the medicine stock management system with NFC tracking

-- Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  facility_type VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  region VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Medicine Categories Table
CREATE TABLE IF NOT EXISTS medicine_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Medicines Table
CREATE TABLE IF NOT EXISTS medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stock Batches Table
CREATE TABLE IF NOT EXISTS stock_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(batch_number, facility_id)
);

-- NFC Tags Table
CREATE TABLE IF NOT EXISTS nfc_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id VARCHAR(100) NOT NULL UNIQUE,
  nfc_code VARCHAR(255) NOT NULL UNIQUE,
  batch_id UUID NOT NULL REFERENCES stock_batches(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  scanned BOOLEAN DEFAULT FALSE,
  last_scanned_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_nfc_code (nfc_code),
  INDEX idx_tag_id (tag_id),
  INDEX idx_batch_id (batch_id),
  INDEX idx_facility_id (facility_id)
);

-- NFC Scan History Table
CREATE TABLE IF NOT EXISTS nfc_scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  scanned_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_nfc_tag (nfc_tag_id),
  INDEX idx_scanned_at (scanned_at),
  INDEX idx_facility (facility_id)
);

-- Stock Movements Table (for tracking transfers between facilities)
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMP DEFAULT NOW(),
  received_at TIMESTAMP,
  INDEX idx_batch (batch_id),
  INDEX idx_from_facility (from_facility_id),
  INDEX idx_to_facility (to_facility_id),
  INDEX idx_created_at (created_at)
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES medicines(id),
  batch_id UUID REFERENCES stock_batches(id),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium',
  message TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  resolved_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_facility (facility_id),
  INDEX idx_created_at (created_at),
  INDEX idx_is_resolved (is_resolved)
);

-- Create indexes for better query performance
CREATE INDEX idx_medicines_category ON medicines(category_id);
CREATE INDEX idx_medicines_status ON medicines(status);
CREATE INDEX idx_batches_medicine ON stock_batches(medicine_id);
CREATE INDEX idx_batches_facility ON stock_batches(facility_id);
CREATE INDEX idx_batches_status ON stock_batches(status);
CREATE INDEX idx_batches_expiry ON stock_batches(expiry_date);
CREATE INDEX idx_scan_history_time ON nfc_scan_history(scanned_at DESC);
