# NFC Tracking System Guide

## Overview

The NFC (Near Field Communication) tracking system provides real-time identification and tracking of medicine items across the Botswana healthcare supply chain. Each medicine batch is tagged with a unique NFC code that enables instant verification, location tracking, and environmental condition monitoring.

## System Components

### 1. **NFC Tags** (`lib/data.ts`)
- Unique identifier for each medicine batch
- Contains: NFC code, batch number, expiry date, quantity, location, temperature/humidity
- Status: active, inactive, expired, or damaged

### 2. **NFC Scanner** (`components/dashboard/nfc-scanner.tsx`)
- Simulates NFC device scanning capabilities
- Manual NFC code input for testing
- Quick scan buttons for available test tags
- Real-time feedback on scanned items

### 3. **NFC Tracker** (`components/dashboard/nfc-tracker.tsx`)
- Search and browse all NFC tags
- Detailed tag information display
- Environmental condition monitoring
- Batch and location tracking

### 4. **NFC Management Page** (`app/dashboard/facility/nfc-tracking/page.tsx`)
- Complete management interface
- Integrated scanner and tracker
- Statistics and charts
- Recent scans history

### 5. **NFC Information** (`components/dashboard/nfc-info.tsx`)
- System overview and benefits
- Comprehensive usage guide
- Tag data structure documentation
- Best practices and status meanings

## Features

### Real-time Tracking
- Scan medicine tags to instantly verify authenticity
- Track location changes throughout supply chain
- Record timestamp of each scan for audit trail

### Environmental Monitoring
- Temperature tracking (recommended: 15-25°C)
- Humidity monitoring (recommended: 30-70%)
- Alerts for storage condition violations

### Expiry Management
- Automatic expiry date verification
- Visual alerts for items nearing expiration
- Countdown display of days remaining

### Authenticity Verification
- Compare NFC codes with physical package information
- Batch number cross-verification
- Counterfeit detection capabilities

### Supply Chain Visibility
- Real-time location updates
- Movement history and audit trail
- Multi-facility tracking

## How to Use

### Access the System
1. Navigate to **Facility Dashboard** → **NFC Tracking**
2. Or visit `/dashboard/facility/nfc-tracking`

### Scanner Tab
1. **Manual Input**: Enter NFC code in the input field
   - Format: `04:96:8F:A2:42:26:80`
   - Press Enter or click Scan button

2. **Quick Scan**: Click any available test tag button to simulate a scan

3. **View Results**: Last scanned item is displayed with full details

### Tracker Tab
1. **Search**: Use search bar to find tags by:
   - Medicine name
   - Tag ID
   - Batch number

2. **Select Tag**: Click a tag in the list to view details

3. **Verify Details**: Check:
   - NFC code and batch number
   - Manufacturing and expiry dates
   - Quantity and unit type
   - Current location and facility
   - Temperature and humidity readings
   - Last scan timestamp

### Information Tab
- **Overview**: System capabilities and benefits
- **Benefits**: Key advantages of NFC tracking
- **Data Structure**: Detailed field descriptions
- **Usage Guide**: Step-by-step instructions
- **Status Meanings**: Understanding tag status
- **Best Practices**: Recommended usage guidelines

## NFC Tag Data Structure

Each NFC tag contains the following information:

```json
{
  "tagId": "NFC-TB-001-001",
  "medicineId": "1",
  "medicineName": "Rifampicin 150mg",
  "batchNumber": "RIF-2024-001",
  "manufacturingDate": "2023-06-15",
  "expiryDate": "2026-06-15",
  "quantity": 5000,
  "unit": "tablets",
  "nfcCode": "04:96:8F:A2:42:26:80",
  "scanned": true,
  "lastScanned": "2024-01-15T09:30:00",
  "location": "Shelf A1",
  "facility": "CMS Gaborone",
  "status": "active",
  "temperature": 22,
  "humidity": 45
}
```

## Tag Status Meanings

| Status | Meaning | Action |
|--------|---------|--------|
| **active** | Ready for use | Distribute and use normally |
| **inactive** | Temporarily disabled | Investigate before using |
| **expired** | Expiry date passed | Do not use - dispose properly |
| **damaged** | Package or contents damaged | Do not use - investigate damage |

## Test NFC Codes

For testing purposes, use these NFC codes:

- `04:96:8F:A2:42:26:80` - Rifampicin 150mg
- `04:A8:7F:B3:52:36:90` - Isoniazid 100mg
- `04:C2:5D:E1:78:42:A0` - Pyrazinamide 500mg
- `04:D3:6C:F2:89:53:B1` - Artemether-Lumefantrine
- `04:E4:7D:03:9A:64:C2` - Metformin 500mg
- `04:F5:8E:14:AB:75:D3` - Rifampicin 150mg (Batch 2)

## Key Metrics

### Dashboard Statistics
- **Total Tags**: Number of NFC tags in system
- **Scanned**: Count and percentage of recently scanned tags
- **Active**: Number of tags ready for distribution
- **Expired**: Number of tags past expiry date

### Facility Status Chart
- Scanned vs. total tags by facility
- Identification of facilities needing attention

### Tag Status Distribution
- Visual breakdown of tag statuses
- Quick identification of problematic tags

## Best Practices

1. **Regular Scanning**
   - Scan tags during receipt, storage transfer, and dispensing
   - Maintain complete audit trail of all movements

2. **Environment Monitoring**
   - Check temperature/humidity readings regularly
   - Investigate and document any excursions

3. **Verification**
   - Always verify NFC codes match physical package
   - Report any discrepancies immediately

4. **Location Updates**
   - Update location when medicine is moved
   - Maintain accurate tracking throughout supply chain

5. **Tag Maintenance**
   - Keep NFC tags clean and protected
   - Replace damaged or unreadable tags
   - Store tags away from excessive moisture or heat

6. **Documentation**
   - Record all scans in facility log
   - Document any storage condition issues
   - Report counterfeit suspicions to supervisors

## Integration with Other Systems

The NFC tracking system integrates with:

- **Stock Management**: Update inventory levels based on scans
- **Continuity Alerts**: Flag medicines at risk of expiration
- **Supply Chain**: Track shipment progress
- **Patient Safety**: Ensure patients receive authentic medicines

## Troubleshooting

### NFC Code Not Found
- Verify the code format (XX:XX:XX:XX:XX:XX:XX)
- Check for typos in the NFC code
- Ensure the tag exists in the system database

### Temperature/Humidity Alerts
- Check storage facility conditions
- Investigate storage location for issues
- Document environmental excursion
- Plan remedial actions

### Tag Not Scanning
- Ensure NFC device has NFC capability
- Check tag for physical damage
- Verify device's NFC settings are enabled
- Try scanning from different angle

## Support and Escalation

For issues or questions:

1. **Technical Issues**: Contact IT Support
2. **Medicine Quality Issues**: Escalate to Pharmacy Supervisor
3. **Counterfeit Concerns**: Report to Quality Assurance Team
4. **System Enhancement Requests**: Submit to Project Management

## Future Enhancements

Planned improvements to the NFC tracking system:

- Real NFC device integration
- Mobile app for field scanning
- Automated cold chain monitoring
- Real-time cloud synchronization
- Advanced analytics and reporting
- Integration with pharmacy management systems
- Barcode + NFC hybrid tracking
- Automated expiry notification system

## Summary

The NFC tracking system is a critical component of the Botswana medicine supply chain, providing:

✓ Real-time medicine identification  
✓ Supply chain visibility  
✓ Authenticity verification  
✓ Environmental condition monitoring  
✓ Expiry date management  
✓ Complete audit trails  
✓ Counterfeit prevention  

By using this system consistently and following best practices, healthcare facilities can ensure patients receive authentic, high-quality medicines while maintaining complete visibility of the supply chain.
