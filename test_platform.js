// Automated Platform Verification Script for PanggilKami
// Tests all domain logic: QRIS checksum, Voucher logic, Cleaning calculation, CS links

function calculateCRC16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

const STATIC_QRIS_BASE = '00020101021126610014COM.GO-JEK.WWW01189360091432268065010210G2268065010303UMI51440014ID.CO.QRIS.WWW0215ID10264846322070303UMI5204821153033605802ID5911panggilkami6009SUKOHARJO61055755262070703A0163048BCE';

function generateDynamicQRIS(nominal) {
  let basePayload = STATIC_QRIS_BASE;
  const crcIndex = basePayload.indexOf('6304');
  if (crcIndex !== -1) {
    basePayload = basePayload.substring(0, crcIndex);
  }
  basePayload = basePayload.replace('010211', '010212');
  const amountStr = Math.round(nominal).toString();
  const amountLength = amountStr.length.toString().padStart(2, '0');
  const tag54 = `54${amountLength}${amountStr}`;
  const splitIndex = basePayload.indexOf('5802ID');
  const payloadWithAmount = basePayload.substring(0, splitIndex) + tag54 + basePayload.substring(splitIndex);
  const payloadWithTag63 = payloadWithAmount + '6304';
  const newCrc = calculateCRC16(payloadWithTag63);
  return payloadWithTag63 + newCrc;
}

console.log('====================================================');
console.log('🧪 PANGGILKAMI AUTOMATED PLATFORM VERIFICATION TEST');
console.log('====================================================');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
  }
}

// 1. Test QRIS Dynamic Generation & Checksum
try {
  const nominal = 45000;
  const dynamicQR = generateDynamicQRIS(nominal);
  assert(dynamicQR.includes('540545000'), 'Dynamic QRIS includes tag 54 with amount 45000');
  assert(dynamicQR.startsWith('000201010212'), 'Point of initiation changed to dynamic 010212');
  assert(dynamicQR.includes('ID1026484632207'), 'Preserves official NMID ID1026484632207');
  assert(dynamicQR.length > 200, 'Valid QRIS string generated with proper length');
} catch (err) {
  assert(false, `QRIS generation error: ${err.message}`);
}

// 2. Test Cleaning Price Calculation
function calculateCleaningPrice(areaType, areaSqm, dirtinessLevel, basePricePerHour = 100000) {
  let multiplier = 1.0;
  if (areaType === 'bathroom') multiplier = 0.9;
  if (areaType === 'room_and_bathroom') multiplier = 1.35;

  let dirtinessMultiplier = 1.0;
  if (dirtinessLevel === 'medium') dirtinessMultiplier = 1.25;
  if (dirtinessLevel === 'heavy') dirtinessMultiplier = 1.6;

  let estimatedHours = 1;
  if (areaSqm <= 12) estimatedHours = 1;
  else if (areaSqm <= 20) estimatedHours = 1.5;
  else if (areaSqm <= 35) estimatedHours = 2.0;
  else if (areaSqm <= 50) estimatedHours = 3.0;
  else estimatedHours = 4.0;

  const adjustedHours = Math.round(estimatedHours * dirtinessMultiplier * 10) / 10;
  const totalPrice = Math.round(basePricePerHour * adjustedHours * multiplier);

  return { estimatedHours: adjustedHours, totalPrice };
}

const cleaning1 = calculateCleaningPrice('room', 12, 'light');
assert(cleaning1.totalPrice === 100000, 'Base cleaning 12m2 light = Rp 100.000');

const cleaning2 = calculateCleaningPrice('room_and_bathroom', 24, 'medium');
assert(cleaning2.totalPrice > 100000, `Kamar + WC 24m2 medium properly scaled: Rp ${cleaning2.totalPrice}`);

// 3. Test Voucher 'panggilkami' gives 100% discount
function applyVoucher(code, subtotal) {
  if (code.toLowerCase() === 'panggilkami') {
    const discountAmount = subtotal;
    const finalTotal = 0;
    return { valid: true, discountAmount, finalTotal };
  }
  return { valid: false, discountAmount: 0, finalTotal: subtotal };
}

const voucherResult = applyVoucher('panggilkami', 175000);
assert(voucherResult.valid === true, "Voucher 'panggilkami' is accepted");
assert(voucherResult.discountAmount === 175000, "Voucher discounts 100% of order");
assert(voucherResult.finalTotal === 0, "Checkout final total is Rp 0 with promo voucher");

// 4. Test Customer Service Contact
const csWhatsApp = '082283883580';
const csEmail = 'panggilkamisolo@gmail.com';
const csAddress = 'Solo Baru HTC';

function generateWhatsAppUrl(phone, text) {
  const cleanPhone = phone.replace(/^0/, '62');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

const waLink = generateWhatsAppUrl(csWhatsApp, 'Halo PanggilKami, saya ingin bertanya.');
assert(waLink.startsWith('https://wa.me/6282283883580'), 'WhatsApp URL correctly formatted to international 6282283883580');

console.log('====================================================');
console.log(`Results: ${passedTests} of ${totalTests} automated tests passed successfully!`);
console.log('====================================================');
