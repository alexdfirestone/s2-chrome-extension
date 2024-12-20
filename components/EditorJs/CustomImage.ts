import { API, BlockTool, BlockToolData } from '@editorjs/editorjs';

interface CustomImageData {
  url: string;
}

export default class CustomImage implements BlockTool {
  private data: CustomImageData;
  private wrapper: HTMLElement;
  private api: API;
  private readOnly: boolean;

  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, api, readOnly }: { data: CustomImageData; api: API; readOnly?: boolean }) {
    this.data = {
      url: data.url || ''
    };
    this.api = api;
    this.readOnly = readOnly || false;
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('custom-image-block');
  }

  render() {
    const container = document.createElement('div');
    container.classList.add('custom-image-container');

    if (this.data.url) {
      this._createImage(container);
    } else if (!this.readOnly) {
      this._createImageUploader(container);
    }

    return container;
  }

  private _createImage(container: HTMLElement) {
    const image = document.createElement('img');
    image.src = this.data.url;
    image.classList.add('custom-image');
    
    if (!this.readOnly) {
      image.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              this.data.url = e.target?.result as string;
              image.src = this.data.url;
            };
            reader.readAsDataURL(file);
          }
        });
        
        input.click();
      });
      image.style.cursor = 'pointer';
      image.title = 'Click to replace image';
    }

    container.appendChild(image);
  }

  private _createImageUploader(container: HTMLElement) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    const button = document.createElement('button');
    button.textContent = 'Click to Upload Image';
    button.classList.add('image-upload-button');

    button.addEventListener('click', () => {
      input.click();
    });

    input.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.data.url = e.target?.result as string;
          container.innerHTML = '';
          this._createImage(container);
        };
        reader.readAsDataURL(file);
      }
    });

    container.appendChild(button);
    container.appendChild(input);
  }

  save(blockContent: HTMLElement) {
    return this.data;
  }

  validate(data: CustomImageData) {
    return data.url.length > 0;
  }
} 