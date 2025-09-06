# SmartHub Static Website Deployment Guide

Complete deployment guide for SmartHub static React application on OVH Performance hosting.

## Prerequisites
- OVH hosting account 
- Built production files in `dist/` directory
- FTP/SSH access credentials (or Git integration)

## OVH Hosting Configuration
- **Host**: fohaixl.cluster100.hosting.ovh.net
- **FTP Server**: ftp.cluster100.hosting.ovh.net  
- **SSH Server**: ssh.cluster100.hosting.ovh.net:22
- **Username**: fohaixl
- **Password**: [Retrieved from OVH Manager]
- **Web Directory**: `/www/smarthub/`

## Static Website Deployment Process

### 1. Build Static Application
```bash
# Build static website (no backend needed)
npm run build

# Verify build output in dist/
ls dist/
```

### 2. Deploy via Git Integration (Recommended)

OVH provides Git integration for automatic deployments:

**Repository Configuration**:
- **Repository**: `https://github.com/jalelchniti/smarthubnew.git`
- **Branch**: `master`
- **Domain**: `www.smarthub.com.tn` → `/smarthub/` folder

**Automatic Deployment Process**:
1. Push changes to `master` branch
2. OVH webhook triggers automatic deployment
3. Build process runs automatically
4. Site goes live on configured domains

**Domain Configuration**:
- Primary: `smarthub.com.tn`
- Secondary: `www.smarthub.com.tn` 
- Alternative: `u-smart.tn`
- Alternative: `www.u-smart.tn`

### 3. Manual FTP Deployment (Backup Method)

**Get Current Credentials from OVH Manager**:
1. Login to manager.ovh.com → Web hosting → fohaixl
2. Go to FTP-SSH tab → Change password (if needed)
3. Wait 15-20 minutes for credential propagation

```bash
# Option 1: FileZilla (Recommended)
# Host: ftp.cluster100.hosting.ovh.net
# Username: fohaixl  
# Password: [From OVH Manager]
# Port: 21, Mode: Passive, Encryption: Explicit FTP over TLS
# Upload dist/ contents to /www/smarthub/

# Option 2: Command-line FTP
ftp ftp.cluster100.hosting.ovh.net
# Navigate to /www/smarthub/ and upload all dist/ files
```

### 4. Verify Deployment

**Live URLs**:
- **Primary**: `https://smarthub.com.tn/`
- **Secondary**: `https://www.smarthub.com.tn/`
- **Alternative**: `https://u-smart.tn/`
- **Alternative**: `https://www.u-smart.tn/`
- **Fallback**: `http://fohaixl.cluster100.hosting.ovh.net/smarthub/`

## Static Website Features

✅ **Contact Integration** - WhatsApp & Phone contact buttons throughout  
✅ **Teacher Profiles** - Static teacher information with contact options  
✅ **Room Information** - Detailed room descriptions and amenities  
✅ **Google Maps** - Interactive location map  
✅ **Mobile Responsive** - Works perfectly on all devices  
✅ **Fast Loading** - Optimized static site performance  
✅ **Professional Design** - Modern UI with Tailwind CSS  

## Business Contact Strategy

The simplified SmartHub website focuses on **direct contact conversion**:

- **Primary Contact**: WhatsApp (+216 99 730 144)
- **Secondary Contact**: Phone (+216 99 730 144)
- **Email**: contact@smarthub.com.tn
- **Address**: Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis

**Contact Integration Points**:
- Navigation bar (WhatsApp + Phone buttons)
- Teacher profiles (WhatsApp contact for each teacher)
- Footer (Complete contact information)
- Call-to-action sections throughout

## Troubleshooting

### Build Issues
```bash
# Check for TypeScript errors
npm run lint

# Fix any issues and rebuild
npm run build
```

### FTP Authentication (530 Error)
1. Reset password in OVH Manager → FTP-SSH tab
2. Wait 15-20 minutes for propagation
3. Try FileZilla with passive mode and explicit TLS

### Git Deployment Issues
1. Ensure webhook is properly configured
2. Check repository permissions
3. Verify domain configuration in OVH
4. Wait for DNS propagation (24-48 hours)

## DNS Configuration Status

**Current Status**: All domains correctly configured and propagating

- **smarthub.com.tn** → A record → `5.135.23.164`
- **www.smarthub.com.tn** → A record → `5.135.23.164`
- **u-smart.tn** → A record → `5.135.23.164`
- **www.u-smart.tn** → A record → `5.135.23.164`

**DNS Servers**: `dns1.tn.ovh.net`, `ns1.tn.ovh.net`
**SSL Certificates**: Auto-issued after domain validation

## Support Information

- **Business Contact**: contact@smarthub.com.tn
- **Phone/WhatsApp**: +216 99 730 144
- **Location**: Rue de Belgique, Immeuble MAE, 1000 Tunis
- **Hours**: Mon-Fri (8:00-20:00), Sat-Sun (9:00-18:00)