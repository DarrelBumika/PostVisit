# Frontend Testing Guide

## Development

```bash
npm run dev
```

Access at http://localhost:3000

## Testing the UI

### 1. Homepage
- Navigate to http://localhost:3000
- Should show landing page with instructions

### 2. View Sample Visit
- Click "View Sample Visit" button
- Should load wizard Step 1 (Diagnosis)

### 3. Navigate Wizard Steps
- Click "Next →" to go through all steps
- Click "← Back" to return to previous steps
- Verify data displays correctly on each step

### 4. Chat Interface
- On Step 4, verify chat window appears
- Type a question and click Send
- Verify response appears in chat
- Check that previous messages persist

### 5. Error Handling
- Try accessing with invalid token: `/visit/invalid-token-xyz`
- Should show error message with option to go home

## Mobile Responsiveness

Test on different screen sizes:
- Desktop (1920px, 1280px)
- Tablet (768px)
- Mobile (375px)

Use Chrome DevTools responsive mode to test.

## Accessibility Checklist

- [ ] All buttons have clear labels
- [ ] Chat messages have timestamps
- [ ] Colors are readable with good contrast
- [ ] Forms can be navigated with keyboard
- [ ] Error messages are clear

## Performance

- First page load should be < 3 seconds
- Chat response should appear within 5 seconds
- Smooth scrolling in chat window
