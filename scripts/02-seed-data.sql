-- Seed basic data for the medicine management system

-- Insert Medicine Categories
INSERT INTO medicine_categories (name, description) VALUES
('TB Medicines', 'Tuberculosis treatment medications'),
('Antimalarial', 'Malaria treatment medications'),
('Chronic Disease', 'Chronic disease management medications'),
('Antiretroviral', 'HIV treatment medications'),
('Antibiotics', 'Antibiotic medications'),
('Antihistamines', 'Allergy and antihistamine medications')
ON CONFLICT (name) DO NOTHING;

-- Insert Suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES
('Botswana Medical Suppliers', 'John Mosweu', 'john@bms.bw', '+267 71 234 567', 'Plot 123, Gaborone Industrial Park'),
('African Pharma Ltd', 'Mary Kgomokate', 'mary@africanpharma.bw', '+267 72 345 678', 'Francistown Medical Hub'),
('Global Health Solutions', 'Peter Okafor', 'peter@globalhealthsol.bw', '+267 73 456 789', 'Maun Business District'),
('Botswana Health Depot', 'Grace Motlanthe', 'grace@bhd.bw', '+267 74 567 890', 'Molepolole Healthcare Center')
ON CONFLICT (name) DO NOTHING;

-- Insert Facilities (Botswana Healthcare Facilities)
INSERT INTO facilities (name, facility_type, district, region, latitude, longitude, contact_person, email, phone) VALUES
('CMS Gaborone', 'Central Store', 'Gaborone', 'South-East District', -24.6282, 25.9123, 'Dr. Kagiso Tswana', 'info@cmsgaborone.bw', '+267 391 30000'),
('Princess Marina Hospital', 'District Hospital', 'Gaborone', 'South-East District', -24.6500, 25.9200, 'Dr. Modise Molefe', 'pmh@bw.health', '+267 391 30000'),
('Nyangabgwe Hospital', 'District Hospital', 'Francistown', 'North-East District', -21.1667, 27.7500, 'Dr. Omodise Pitlagane', 'nyh@bw.health', '+267 241 04000'),
('Maun General Hospital', 'District Hospital', 'Maun', 'Kgatleng District', -19.9833, 23.4167, 'Dr. Kamogelo Sealakoko', 'mgh@bw.health', '+267 686 30000'),
('Tsabong Hospital', 'District Hospital', 'Tsabong', 'Kgalagadi District', -26.1333, 23.7333, 'Dr. Thabo Motshabi', 'tsh@bw.health', '+267 654 30000'),
('Serowe Hospital', 'District Hospital', 'Serowe', 'Central District', -22.3869, 26.1278, 'Dr. Lesego Motsabi', 'srh@bw.health', '+267 432 30000'),
('Molepolole Health Center', 'Primary Health Center', 'Molepolole', 'South-Central District', -24.9000, 26.1167, 'Sister Boitumelo Motlhanthe', 'mhc@bw.health', '+267 532 30000'),
('Palapye Medical Clinic', 'Primary Health Center', 'Palapye', 'Central District', -21.7833, 27.1000, 'Sister Naledi Thamane', 'pmc@bw.health', '+267 342 30000')
ON CONFLICT (name) DO NOTHING;

-- Get category IDs for inserts
DO $$
DECLARE
  v_tb_cat UUID;
  v_anti_cat UUID;
  v_chronic_cat UUID;
BEGIN
  SELECT id INTO v_tb_cat FROM medicine_categories WHERE name = 'TB Medicines';
  SELECT id INTO v_anti_cat FROM medicine_categories WHERE name = 'Antimalarial';
  SELECT id INTO v_chronic_cat FROM medicine_categories WHERE name = 'Chronic Disease';

  -- Insert TB Medicines
  INSERT INTO medicines (name, generic_name, code, nappi_code, who_atc_code, atc_name, dosage_form, category_id, unit_price, schedule, status) VALUES
  ('Rifampicin 150mg', 'Rifampicin', 'RIF-150', 2548012, 'J04AB02', 'Rifampicin', 'Tablet', v_tb_cat, 25.50, 'S3', 'active'),
  ('Isoniazid 100mg', 'Isoniazid', 'ISO-100', 2548014, 'J04AC01', 'Isoniazid', 'Tablet', v_tb_cat, 15.75, 'S3', 'active'),
  ('Pyrazinamide 500mg', 'Pyrazinamide', 'PYR-500', 2548016, 'J04AK01', 'Pyrazinamide', 'Tablet', v_tb_cat, 18.30, 'S3', 'active'),
  ('Ethambutol 400mg', 'Ethambutol', 'ETH-400', 2548018, 'J04AK02', 'Ethambutol', 'Tablet', v_tb_cat, 22.00, 'S3', 'active'),
  ('Rifampicin/Isoniazid FDC', 'Rifampicin/Isoniazid', 'RIF-ISO-FDC', 2548020, 'J04AM05', 'Rifampicin and Isoniazid', 'Tablet', v_tb_cat, 35.00, 'S3', 'active'),
  
  -- Insert Antimalarial Medicines
  ('Artemether-Lumefantrine', 'Artemether-Lumefantrine', 'ART-LUME', 2550001, 'P01BF01', 'Artemether and Lumefantrine', 'Tablet', v_anti_cat, 45.99, 'S2', 'active'),
  ('Quinine Sulphate 300mg', 'Quinine', 'QUIN-300', 2550003, 'P01BC01', 'Quinine', 'Tablet', v_anti_cat, 28.50, 'S4', 'active'),
  ('Artesunate IV 60mg', 'Artesunate', 'ARTES-IV', 2550005, 'P01BF03', 'Artesunate', 'Powder for Injection', v_anti_cat, 120.00, 'S2', 'active'),
  ('Sulfadoxine-Pyrimethamine', 'Sulfadoxine-Pyrimethamine', 'SULFA-PYRI', 2550007, 'P01DC01', 'Sulfadoxine and Pyrimethamine', 'Tablet', v_anti_cat, 15.00, 'S3', 'active'),
  
  -- Insert Chronic Disease Medicines
  ('Metformin 500mg', 'Metformin', 'MET-500', 2551001, 'A10BA02', 'Metformin', 'Tablet', v_chronic_cat, 12.50, 'S2', 'active'),
  ('Amlodipine 5mg', 'Amlodipine', 'AML-5', 2551003, 'C08CA01', 'Amlodipine', 'Tablet', v_chronic_cat, 18.75, 'S2', 'active'),
  ('Enalapril 10mg', 'Enalapril', 'ENAL-10', 2551005, 'C09AA02', 'Enalapril', 'Tablet', v_chronic_cat, 16.50, 'S2', 'active'),
  ('Hydrochlorothiazide 25mg', 'Hydrochlorothiazide', 'HCTZ-25', 2551007, 'C03AA05', 'Hydrochlorothiazide', 'Tablet', v_chronic_cat, 9.99, 'S2', 'active'),
  ('Atenolol 50mg', 'Atenolol', 'ATEN-50', 2551009, 'C07AA05', 'Atenolol', 'Tablet', v_chronic_cat, 14.25, 'S2', 'active')
  ON CONFLICT (code) DO NOTHING;
END $$;

-- Insert Sample Stock Batches
DO $$
DECLARE
  v_cms_id UUID;
  v_pmh_id UUID;
  v_rif_id UUID;
  v_iso_id UUID;
  v_art_id UUID;
  v_met_id UUID;
  v_supplier_id UUID;
BEGIN
  SELECT id INTO v_cms_id FROM facilities WHERE name = 'CMS Gaborone';
  SELECT id INTO v_pmh_id FROM facilities WHERE name = 'Princess Marina Hospital';
  SELECT id INTO v_rif_id FROM medicines WHERE code = 'RIF-150';
  SELECT id INTO v_iso_id FROM medicines WHERE code = 'ISO-100';
  SELECT id INTO v_art_id FROM medicines WHERE code = 'ART-LUME';
  SELECT id INTO v_met_id FROM medicines WHERE code = 'MET-500';
  SELECT id INTO v_supplier_id FROM suppliers WHERE name = 'Botswana Medical Suppliers';

  INSERT INTO stock_batches (medicine_id, facility_id, batch_number, supplier_id, manufacturing_date, expiry_date, quantity_received, quantity_current, unit, location, temperature, humidity, status) VALUES
  (v_rif_id, v_cms_id, 'RIF-2024-001', v_supplier_id, '2023-06-15', '2026-06-15', 5000, 4800, 'tablets', 'Shelf A1', 22.5, 45.0, 'active'),
  (v_iso_id, v_pmh_id, 'ISO-2024-002', v_supplier_id, '2023-08-20', '2026-08-20', 3000, 2850, 'tablets', 'Shelf B2', 21.0, 48.0, 'active'),
  (v_art_id, v_cms_id, 'ART-2024-005', v_supplier_id, '2023-09-01', '2025-09-01', 4500, 4200, 'tablets', 'Shelf D1', 23.0, 46.0, 'active'),
  (v_met_id, v_pmh_id, 'MET-2024-010', v_supplier_id, '2023-07-22', '2026-07-22', 6000, 5500, 'tablets', 'Shelf E2', 22.0, 47.0, 'active')
  ON CONFLICT DO NOTHING;
END $$;
