// Comprehensive Settings Domain Service for Ahsan Autos Showroom & Print Center

const SETTINGS_STORAGE_KEY = 'ahsan_showroom_settings_v1';

export const DEFAULT_SETTINGS = {
  showroomName: 'Ahsan Autos',
  tagline: 'Premium Used Car Dealership & Automotive POS',
  logoUrl: '',
  logoText: 'AHSAN AUTOS',
  address: 'Plot 42-B, Main Automotive Boulevard, G-8 Markaz, Islamabad',
  city: 'Islamabad',
  phone: '+92 300 1234567',
  whatsapp: '+92 313 2066883',
  email: 'info@ahsanautos.pk',
  ntn: '8912344-7',

  // Social Channels
  social: {
    tiktok: '@ahsan_autos',
    instagram: '@ahsanautos_official',
    facebook: 'facebook.com/ahsanautosofficial',
    website: 'Rojrztech.com',
  },

  // Invoice & Sequence Numbering
  invoicePrefix: 'SAL-2026-',
  purchasePrefix: 'PUR-2026-',
  posReceiptPrefix: 'BILL-',
  nextInvoiceSequence: 90,

  // Currency & Thermal Configurations
  currency: 'PKR',
  currencySymbol: '₨',
  thermalWidth: '80mm',

  // Receipt Footer
  receiptFooter: 'Powered By Rojrztech\n03132066883 / 03151210736\nwebsite: Rojrztech.com',

  // Terms & Conditions (Legal Stamp Deed Clauses)
  terms: [
    'Vehicle inspected and handed over in verified condition along with original documents & smart keys.',
    'Buyer undertakes to complete the official excise biometric transfer within 15 working days.',
    'From the date and timestamp of delivery, all civil, criminal, excise, and traffic challan liabilities rest solely with the buyer.',
    'Token/Advance amount is non-refundable once the delivery deed is executed.',
  ],
  receiptDisclaimer: 'Thank you for doing business with Ahsan Autos! Goods once sold will not be returned.',
};

export const settingsService = {
  getSettings: () => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    } catch (err) {
      console.error('Failed to read settings:', err);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (newSettings) => {
    const current = settingsService.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ahsan_settings_updated', { detail: updated }));
    }
    return updated;
  },

  getNextInvoiceNumber: () => {
    const settings = settingsService.getSettings();
    const seq = settings.nextInvoiceSequence || 90;
    const inv = `${settings.invoicePrefix || 'SAL-2026-'}${String(seq).padStart(4, '0')}`;
    settingsService.saveSettings({ nextInvoiceSequence: seq + 1 });
    return inv;
  },
};
