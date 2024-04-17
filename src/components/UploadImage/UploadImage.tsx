'use client';
import * as React from 'react';
import { useFormState } from 'react-dom';
import Image from 'next/image';
import styled from 'styled-components';

import { parseImage } from '@/actions/parseImage';

const initialState = {
  message: null,
};

function UploadImage() {
  const [state, formAction] = useFormState(parseImage, initialState);
  const [previewSrc, setPreviewSrc] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (event: React.FormEvent<HTMLInputElement>) => {
    const files = inputRef.current?.files;

    if (!files) {
      return;
    }

    const file = files[0];

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const src = event.target?.result;

      if (!src) {
        return;
      }

      setPreviewSrc(src.toString());
    };

    reader.readAsDataURL(file);
  };

  const items = state.message?.items;

  return (
    <div>
      <h1>Upload your slip</h1>
      <form action={formAction}>
        <label htmlFor="image">Upload Image</label>
        <input
          id="image"
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          name="slip"
        />
        <button>Submit</button>
      </form>

      <div>
        {previewSrc && (
          <PreviewImage
            src={previewSrc}
            alt="Preview Image of slip"
            width={400}
            height={400}
          />
        )}
      </div>

      <div>
        <h2>What you bought</h2>
        {Array.isArray(items) &&
          items.map((item, index) => (
            <Item key={index}>
              <span>{item.name}</span>
              <span>R{item.price}</span>
            </Item>
          ))}
      </div>
    </div>
  );
}

const Item = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PreviewImage = styled(Image)`
  height: auto;
`;
export default UploadImage;
