import React from 'react';

interface LocalImageProps {
    imageId: string;
    alt?: string;
    className?: string;
}

const STORAGE_KEY = 'flomo_images';

export const LocalImage: React.FC<LocalImageProps> = ({ imageId, alt = '图片', className = '' }) => {
    const [imageData, setImageData] = React.useState<string | null>(null);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        try {
            const images = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const image = images.find((img: { id: string; data: string }) => img.id === imageId);
            if (image) {
                setImageData(image.data);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Error loading image:', err);
            setError(true);
        }
    }, [imageId]);

    if (error) {
        return (
            <div className={`bg-gray-100 rounded flex items-center justify-center ${className}`}>
                <span className="text-gray-400 text-sm">图片加载失败</span>
            </div>
        );
    }

    if (!imageData) {
        return (
            <div className={`bg-gray-50 rounded flex items-center justify-center ${className}`}>
                <span className="text-gray-400 text-sm">加载中...</span>
            </div>
        );
    }

    return (
        <img
            src={imageData}
            alt={alt}
            className={`rounded ${className}`}
            loading="lazy"
        />
    );
};

export default LocalImage; 