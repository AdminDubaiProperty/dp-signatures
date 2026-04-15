import { SignatureData } from '@/types';

export function generateSignatureHtml(data: SignatureData): string {
  return `<style type="text/css">
 :root { color-scheme: light dark; supported-color-schemes: light dark; }
 @media (prefers-color-scheme: dark) {
   .sig-bg { background-color: #1C1A17 !important; }
   .sig-text { color: #F9F9F9 !important; }
   .sig-border { border-color: #2D2821 !important; }
   .sig-link { color: #F9F9F9 !important; }
 }
</style>
<table class="sig-bg" cellpadding="0" cellspacing="0" border="0" style="max-width: 700px; font-family: 'Gilmer', 'Gilmer Sans', Arial, sans-serif; background-color: #F9F9F9; padding: 20px; border-radius: 8px;">
 <tr>
   <td width="140" align="center" valign="middle" style="padding-right: 20px;">
     <img src="${data.photoUrl}" alt="${data.name}" width="110" height="110" style="border-radius: 50%; border: 4px solid #B99A61; padding: 4px; display: block; object-fit: cover;" class="sig-bg">
   </td>
   <td width="2" style="background-color: #8D724A;"></td>
   <td valign="middle" style="padding-left: 20px; padding-right: 20px;">
     <table cellpadding="0" cellspacing="0" border="0">
       <tr>
         <td class="sig-border" style="padding-bottom: 10px; border-bottom: 1px solid #E0E0E0;">
           <div class="sig-text" style="font-size: 20px; font-weight: bold; color: #1C1A17; letter-spacing: 0.5px;">${data.name}</div>
           <div style="font-size: 14px; color: #B99A61; margin-top: 4px;">${data.designation}</div>
         </td>
       </tr>
       <tr>
         <td style="padding-top: 10px;">
           <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; line-height: 20px;">
             <tr>
               <td width="24" valign="middle"><img src="https://api.iconify.design/lucide/phone.svg?color=%23B99A61" width="16" height="16" style="display: block;" alt="Phone"></td>
               <td class="sig-text" style="color: #1C1A17;">${data.phone}</td>
             </tr>
             <tr>
               <td width="24" valign="middle"><img src="https://api.iconify.design/lucide/mail.svg?color=%23B99A61" width="16" height="16" style="display: block;" alt="Email"></td>
               <td><a href="mailto:${data.email}" class="sig-link" style="color: #1C1A17; text-decoration: none;">${data.email}</a></td>
             </tr>
             <tr>
               <td width="24" valign="middle"><img src="https://api.iconify.design/lucide/globe.svg?color=%23B99A61" width="16" height="16" style="display: block;" alt="Website"></td>
               <td><a href="https://www.dubai-property.nl" class="sig-link" style="color: #1C1A17; text-decoration: none;">${data.website}</a></td>
             </tr>
             <tr>
               <td width="24" valign="top" style="padding-top: 2px;"><img src="https://api.iconify.design/lucide/map-pin.svg?color=%23B99A61" width="16" height="16" style="display: block;" alt="Location"></td>
               <td class="sig-text" style="color: #1C1A17;">
                 <a href="https://maps.app.goo.gl/26qMGpAuixPejpub8" class="sig-link" style="color: #1C1A17; text-decoration: none;">${data.address}</a><br>Dubai, VAE
               </td>
             </tr>
           </table>
         </td>
       </tr>
     </table>
   </td>
   <td width="2" style="background-color: #8D724A;"></td>
   <td width="150" align="center" valign="middle" style="padding-left: 20px;">
     <a href="https://www.dubai-property.nl" style="text-decoration: none;">
       <img src="https://cdn.prod.website-files.com/663dca2d822c7860e89c4c5a/69cd2042f60117ec2c2abcd6_Dubai-Property%20Gold%20BG%20logo%20Brandmark.png" alt="Dubai-Property Logo" width="120" style="display: block; margin-bottom: 15px; border: 0;">
     </a>
     <table cellpadding="0" cellspacing="0" border="0">
       <tr>
         <td style="padding: 0 4px;"><a href="${data.facebook}"><img src="https://api.iconify.design/lucide/facebook.svg?color=%23B99A61" alt="Facebook" width="20" height="20" style="display: block; border: 0;"></a></td>
         <td style="padding: 0 4px;"><a href="${data.linkedin}"><img src="https://api.iconify.design/lucide/linkedin.svg?color=%23B99A61" alt="LinkedIn" width="20" height="20" style="display: block; border: 0;"></a></td>
         <td style="padding: 0 4px;"><a href="${data.instagram}"><img src="https://api.iconify.design/lucide/instagram.svg?color=%23B99A61" alt="Instagram" width="20" height="20" style="display: block; border: 0;"></a></td>
       </tr>
     </table>
   </td>
 </tr>
</table>
<table cellpadding="0" cellspacing="0" border="0" style="max-width: 700px; margin-top: 8px;">
  <tr>
    <td style="font-family: 'Gilmer', Arial, sans-serif; font-size: 11px; color: #B99A61; letter-spacing: 0.3px;">
      Official Partner of FC Utrecht
    </td>
  </tr>
</table>`;
}

export const DEFAULT_SIGNATURE_DATA: SignatureData = {
  name: '',
  designation: '',
  phone: '',
  email: '',
  photoUrl: '',
  website: 'www.dubai-property.nl',
  address: 'Bahialaan 602-A, 3065 WC Rotterdam',
  facebook: 'https://www.facebook.com/DubaiPropertyNL',
  linkedin: 'https://www.linkedin.com/company/dubai-property-nl',
  instagram: 'https://www.instagram.com/dubai_property_nl',
};

// Excluded team members (inactive/departed)
export const EXCLUDED_SLUGS = new Set([
  'sandora-wirjasentana',
  'kelvin-lala',
  'yokechia-baumgard',
  'yassin-el-kholy',
  'samar-doebar',
]);
