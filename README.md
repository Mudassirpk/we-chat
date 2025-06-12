# Important

## Naming you services in - main/services/index.ts

```typescript
export const services = { your_controller_name: 'object_containing_services' }
// example:

// main/services/note.service.ts

export const note_services = {
  add: () => {
    console.log('note added')
  }
}

// main/services/index.ts
export const services = { note: note_services }

// so, while calling in renderer use:
// App.tsx
window.context.note_add()
// here note is your controller name and add is the method you defined in note_services
```

### conclusion:

- You can defined you services in - main/services dir
- your controller name should be unique
