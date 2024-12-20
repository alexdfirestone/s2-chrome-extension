// CustomTable.ts
import TableBlock from '@editorjs/table';

class CustomTable extends TableBlock {
  static get toolbox() {
    return {
      icon: '<svg width="12" height="12" viewBox="-1 -1 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 1.5C1 1.22386 1.22386 1 1.5 1H10.5C10.7761 1 11 1.22386 11 1.5V10.5C11 10.7761 10.7761 11 10.5 11H1.5C1.22386 11 1 10.7761 1 10.5V1.5ZM2 2V4H10V2H2ZM2 5V7H4V5H2ZM2 8V10H4V8H2ZM5 5V7H7V5H5ZM5 8V10H7V8H5ZM8 5V7H10V5H8ZM8 8V10H10V8H8Z" fill="#E5E5E5"/></svg>',
      title: 'Table'
    };
  }

  constructor(props: any) {
    super(props);
    
    // Bind the focus tracking method
    this.trackFocus = this.trackFocus.bind(this);
  }

  render() {
    const wrapper = super.render();

    
    // Add focus event listener to the table wrapper
    if (wrapper) {
      wrapper.addEventListener('focusin', this.trackFocus);
    }
    
    return wrapper;
  }

  trackFocus(event: FocusEvent) {
    const target = event.target as HTMLElement;

    console.log('tacking...', target, target.tagName)
    
    if (target && target.tagName === 'DIV') {
      const cell = target;
      const row = cell.parentElement;
      
      if (row) {
        const tbody = row.parentElement;
        if (tbody) {
          const rowIndex = Array.from(tbody.children).indexOf(row);
          const cellIndex = Array.from(row.children).indexOf(cell);
          
          // Access the internal table instance
          if (this.table) {
            console.log({
              rowIndex,
              cellIndex,
              cellContent: cell.textContent,
              internalFocusedCell: this.table.focusedCell
            });
          }
        }
      }
    }
  }

  destroy() {
    // Clean up event listener
    const wrapper = this.table?.getWrapper();
    if (wrapper) {
      wrapper.removeEventListener('focusin', this.trackFocus as EventListener);
    }
    
    super.destroy();
  }
}

export default CustomTable;