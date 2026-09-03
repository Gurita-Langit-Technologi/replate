
import { useState } from 'react';

const DEFAULT_IMAGE = '/image/image default.jpg';

export function ProductImage({
    src,
    alt = 'Foto Produk',
    className = 'w-full h-full object-cover',
    containerClassName = 'w-full h-full relative overflow-hidden bg-gray-100',
    aspect = 'aspect-square',
}) {
    const [imgError, setImgError] = useState(false);

    // Validasi apakah src adalah dummy / placeholder / kosong
    const isInvalid = !src || src.includes('placeholder') || src.includes('dummy') || src === 'null';

    const imageSrc = (!isInvalid && !imgError)
        ? (src.startsWith('http') || src.startsWith('/image/') ? src : `/storage/${src}`)
        : DEFAULT_IMAGE;

    return (
        <div className={`${containerClassName} ${aspect}`}>
            <img
                src={imageSrc}
                alt={alt}
                onError={() => setImgError(true)}
                className={`${className}`}
                loading="lazy"
            />
        </div>
    );
}

export default ProductImage;
