/* eslint-disable @typescript-eslint/no-require-imports */
// Generate professional notification sounds using pure JavaScript
// Run with: node scripts/generate-sounds.js

const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;

// Helper to create WAV header
function createWavHeader(dataLength) {
  const buffer = Buffer.alloc(44);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20); // audio format (PCM)
  buffer.writeUInt16LE(1, 22); // channels
  buffer.writeUInt32LE(SAMPLE_RATE, 24); // sample rate
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

// Generate a sine wave with envelope
function generateTone(frequency, duration, envelope = 'decay') {
  const samples = Math.floor(SAMPLE_RATE * duration);
  const buffer = Buffer.alloc(samples * 2);

  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / samples;

    // Calculate envelope
    let amp;
    if (envelope === 'decay') {
      amp = Math.exp(-3 * progress);
    } else if (envelope === 'bell') {
      amp = Math.sin(Math.PI * progress) * Math.exp(-2 * progress);
    } else if (envelope === 'pluck') {
      amp = Math.exp(-5 * progress);
    } else if (envelope === 'soft') {
      const attack = Math.min(1, progress * 10);
      const release = Math.max(0, 1 - (progress - 0.7) * 3.33);
      amp = attack * release * Math.exp(-1.5 * progress);
    }

    // Generate tone with slight harmonics for richness
    let sample = Math.sin(2 * Math.PI * frequency * t) * 0.7;
    sample += Math.sin(4 * Math.PI * frequency * t) * 0.2;
    sample += Math.sin(6 * Math.PI * frequency * t) * 0.1;

    sample *= amp * 0.7; // Master volume

    // Convert to 16-bit
    const value = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(value, i * 2);
  }

  return buffer;
}

// Generate chime (multiple ascending tones)
function generateChime(baseFreq, notes, noteDuration) {
  const buffers = [];
  const noteGap = Math.floor(SAMPLE_RATE * 0.08);

  for (let i = 0; i < notes.length; i++) {
    const freq = baseFreq * Math.pow(2, notes[i] / 12);
    const tone = generateTone(freq, noteDuration, 'bell');

    if (i > 0) {
      // Add silence gap
      buffers.push(Buffer.alloc(noteGap * 2));
    }
    buffers.push(tone);
  }

  return Buffer.concat(buffers);
}

// Generate gentle pulse
function generatePulse(frequency, pulseCount, pulseDuration) {
  const buffers = [];
  const gap = Math.floor(SAMPLE_RATE * 0.15);

  for (let i = 0; i < pulseCount; i++) {
    const tone = generateTone(frequency, pulseDuration, 'soft');
    buffers.push(tone);
    if (i < pulseCount - 1) {
      buffers.push(Buffer.alloc(gap * 2));
    }
  }

  return Buffer.concat(buffers);
}

// Generate deep gong sound
function generateGong(frequency, duration) {
  const samples = Math.floor(SAMPLE_RATE * duration);
  const buffer = Buffer.alloc(samples * 2);

  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / samples;

    // Long decay envelope
    const amp = Math.exp(-1.5 * progress);

    // Rich harmonics for gong sound
    let sample = Math.sin(2 * Math.PI * frequency * t) * 0.5;
    sample += Math.sin(2 * Math.PI * frequency * 1.5 * t) * 0.25;
    sample += Math.sin(2 * Math.PI * frequency * 2 * t) * 0.15;
    sample += Math.sin(2 * Math.PI * frequency * 2.5 * t) * 0.1;

    // Add slight vibrato
    const vibrato = 1 + 0.003 * Math.sin(2 * Math.PI * 5 * t);
    sample *= vibrato;

    sample *= amp * 0.6;

    const value = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(value, i * 2);
  }

  return buffer;
}

// Generate meditation bowl sound
function generateBowl(frequency, duration) {
  const samples = Math.floor(SAMPLE_RATE * duration);
  const buffer = Buffer.alloc(samples * 2);

  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / samples;

    // Soft attack, long decay
    const attack = Math.min(1, progress * 20);
    const decay = Math.exp(-0.8 * progress);
    const amp = attack * decay;

    // Bowl harmonics (slightly inharmonic for authentic sound)
    let sample = Math.sin(2 * Math.PI * frequency * t) * 0.4;
    sample += Math.sin(2 * Math.PI * frequency * 2.71 * t) * 0.3;
    sample += Math.sin(2 * Math.PI * frequency * 5.04 * t) * 0.2;
    sample += Math.sin(2 * Math.PI * frequency * 8.47 * t) * 0.1;

    sample *= amp * 0.5;

    const value = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(value, i * 2);
  }

  return buffer;
}

function saveWav(filename, audioData) {
  const header = createWavHeader(audioData.length);
  const wav = Buffer.concat([header, audioData]);
  const filepath = path.join(__dirname, '..', 'public', 'sounds', filename);
  fs.writeFileSync(filepath, wav);
  console.log(`Created: ${filename} (${wav.length} bytes)`);
}

// Generate sounds
console.log('Generating notification sounds...\n');

// 1. Focus Start - Uplifting chime (C-E-G major chord ascending)
const focusStart = generateChime(523.25, [0, 4, 7], 0.4);
saveWav('focus-start.wav', focusStart);

// 2. Focus End - Meditation bowl (signals completion, peaceful)
const focusEnd = generateBowl(396, 2.0);
saveWav('focus-end.wav', focusEnd);

// 3. Timeout Start - Soft double pulse (gentle reminder to rest)
const timeoutStart = generatePulse(440, 2, 0.25);
saveWav('timeout-start.wav', timeoutStart);

// 4. Timeout End - Deep gong (signals return to work)
const timeoutEnd = generateGong(196, 1.8);
saveWav('timeout-end.wav', timeoutEnd);

// Additional sounds for variety
// 5. Simple bell
const simpleBell = generateTone(880, 0.8, 'bell');
saveWav('bell.wav', simpleBell);

// 6. Soft chime (G-B-D)
const softChime = generateChime(392, [0, 4, 7], 0.35);
saveWav('soft-chime.wav', softChime);

// 7. Triple ding
const tripleDing = generatePulse(659.25, 3, 0.2);
saveWav('triple-ding.wav', tripleDing);

// 8. Zen bowl
const zenBowl = generateBowl(264, 2.5);
saveWav('zen-bowl.wav', zenBowl);

console.log('\nDone! All sounds generated.');
