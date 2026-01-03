let consoleLog = [];
const MAX_CONSOLE_ENTRIES = 100;


export function initDebugTools(k) {
  const originalLog = console.log;
  console.log = function(...args) {
    const timestamp = new Date().toLocaleTimeString();
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    consoleLog.push(`[${timestamp}] ${message}`);
    
    if (consoleLog.length > MAX_CONSOLE_ENTRIES) {
      consoleLog.shift();
    }
    
    originalLog.apply(console, args);
  };

  k.onKeyPress("f9", () => {
    takeScreenshot(k);
  });

  k.onKeyPress("f10", () => {
    captureConsole();
  });

  k.onKeyPress("f11", () => {
    takeScreenshotAndConsole(k);
  });

  console.log('🔧 Debug tools initialized!');
  console.log('📸 F9 = Screenshot | 📋 F10 = Console Capture | 🎯 F11 = Both');
}


function takeScreenshot(k) {
  try {
    const canvas = k.canvas;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `catastrophe2_screenshot_${timestamp}.png`;
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      
      console.log(`📸 Screenshot saved: ${filename}`);
    });
  } catch (error) {
    console.error('❌ Screenshot failed:', error);
  }
}

function captureConsole() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `catastrophe2_console_${timestamp}.txt`;
    
    const content = [
      '='.repeat(60),
      'CATastrophe 2 - Console Capture',
      `Captured at: ${new Date().toLocaleString()}`,
      '='.repeat(60),
      '',
      ...consoleLog,
      '',
      '='.repeat(60),
      `Total entries: ${consoleLog.length}`,
      '='.repeat(60)
    ].join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    console.log(`📋 Console log saved: ${filename} (${consoleLog.length} entries)`);
  } catch (error) {
    console.error('❌ Console capture failed:', error);
  }
}


function takeScreenshotAndConsole(k) {
  console.log('🎯 Capturing screenshot and console...');
  takeScreenshot(k);
  setTimeout(() => captureConsole(), 100);
}


export function clearConsoleLog() {
  consoleLog = [];
  console.log('🧹 Console log cleared');
}


export function getConsoleLog() {
  return [...consoleLog];
}