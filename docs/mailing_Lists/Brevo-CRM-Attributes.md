# Brevo CRM Attributes - SmartHub

This document contains all CRM attributes configured in Brevo for SmartHub's email marketing system.

## All Configured Attributes

### Personal Information
| Attribute Name | Type | Description |
|---|---|---|
| **EMAIL** | Texte | Contact's email address (primary identifier) |
| **NOM** | Texte | Last name / Surname |
| **PRENOM** | Texte | First name / Given name |
| **SMS** | Texte | Mobile phone number for SMS campaigns |

### Contact Details
| Attribute Name | Type | Description |
|---|---|---|
| **EXT_ID** | Texte | External ID for system integration |
| **LANDLINE_NUMBER** | Texte | Landline/fixed phone number |
| **CONTACT_TIMEZONE** | Texte | Contact's timezone for scheduling |

### Professional Information
| Attribute Name | Type | Description |
|---|---|---|
| **JOB_TITLE** | Texte | Professional job title/position |
| **LINKEDIN** | Texte | LinkedIn profile URL |

### Social Media & Communication
| Attribute Name | Type | Description |
|---|---|---|
| **WHATSAPP** | Texte | WhatsApp number (may differ from SMS) |

### Opt-in Management
| Attribute Name | Type | Description |
|---|---|---|
| **DOUBLE_OPT_IN** | Catégorie | Double opt-in confirmation status |
| **OPT_IN** | Booléen | General opt-in consent status |

### Educational Information (SmartHub Specific)
| Attribute Name | Type | Description |
|---|---|---|
| **CLASS** | Nombre | Student's class level or grade |
| **SECTION** | Choix multiple | Student's section or specialization |
| **MATIERES** | Choix multiple | Academic subjects (new field for subject targeting) |

## Field Mapping for SmartHub Forms

### Student Registration Form
```
NOM → Last name
PRENOM → First name  
EMAIL → Email address
SMS → Mobile phone number
SMS__COUNTRY_CODE → Country code (not stored as separate attribute)
CLASS → Student's grade/class level (optional)
SECTION → Academic section/specialization (optional)
MATIERES → Academic subjects of interest (optional)
```

### Teacher Application Form
```
NOM → Last name
PRENOM → First name
EMAIL → Email address  
SMS → Mobile phone number
SMS__COUNTRY_CODE → Country code (not stored as separate attribute)
JOB_TITLE → Teaching position/specialization (optional)
LINKEDIN → Professional LinkedIn profile (optional)
MATIERES → Teaching subjects/specializations (optional)
```

## Usage Guidelines

### Required Fields
- **EMAIL**: Always required (primary key)
- **NOM**: Required for personalization
- **PRENOM**: Required for personalization
- **SMS**: Required for SMS marketing campaigns

### Optional Fields
- **WHATSAPP**: Use for WhatsApp Business integration
- **LINKEDIN**: For professional networking campaigns
- **JOB_TITLE**: For targeting by profession
- **CONTACT_TIMEZONE**: For optimal send times
- **CLASS**: Student's academic level for educational targeting
- **SECTION**: Student's specialization for subject-specific campaigns
- **MATIERES**: Academic subjects for targeted content delivery

### Data Types
- **Texte**: Free text fields (names, emails, URLs)
- **Booléen**: True/false values (OPT_IN)
- **Catégorie**: Predefined options (DOUBLE_OPT_IN)
- **Nombre**: Numeric values (CLASS level)
- **Choix multiple**: Select from predefined options (SECTION, MATIERES)

## Integration Notes

### Form Submissions
All forms submit to Brevo using exact field names:
- Use uppercase field names (NOM, PRENOM, EMAIL, SMS)
- Include hidden fields: `locale=fr`, `email_address_check=""`
- Country codes handled separately from main SMS field

### Email Personalization
Available tokens in email templates:
```
{{ contact.NOM }} - Last name
{{ contact.PRENOM }} - First name
{{ contact.EMAIL }} - Email address
{{ unsubscribe }} - Unsubscribe link
{{ update_profile }} - Profile management link
```

### Segmentation Possibilities
- **Geographic**: Using CONTACT_TIMEZONE
- **Professional**: Using JOB_TITLE (teachers)
- **Academic Level**: Using CLASS (students) 
- **Academic Specialization**: Using SECTION (students)
- **Subject Interest**: Using MATIERES (both students and teachers)
- **Communication preference**: Using SMS vs WHATSAPP
- **Engagement**: Using OPT_IN status
- **User Type**: Teachers vs Students (based on filled fields)

## Data Privacy Compliance

### GDPR Considerations
- **OPT_IN**: Tracks explicit consent
- **DOUBLE_OPT_IN**: Confirms email validation
- **EXT_ID**: For data portability
- All personal data encrypted in Brevo

### Data Retention
- Active contacts: Indefinite storage
- Unsubscribed contacts: Retain for legal compliance
- Hard bounces: Automatic suppression

## Maintenance

### Regular Tasks
1. **Clean SMS numbers**: Validate format and duplicates
2. **Update job titles**: Standardize professional categories for teachers
3. **Class levels**: Validate numeric ranges for CLASS field
4. **Section options**: Maintain updated SECTION multiple-choice options
5. **Subject options**: Maintain updated MATIERES multiple-choice options
6. **Timezone accuracy**: Keep updated for scheduling
7. **LinkedIn profiles**: Verify active URLs

### Monitoring
- Track opt-in rates by source (student vs teacher forms)
- Monitor data quality scores
- Validate phone number formats
- Check for duplicate contacts
- Analyze CLASS, SECTION, and MATIERES distribution for academic insights

---
**Last Updated**: September 2024
**Source**: Brevo CRM Dashboard - SmartHub Account