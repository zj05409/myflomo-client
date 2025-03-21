import React, { useState, useEffect } from 'react';

interface LocalImageProps {
    imageId: string;
    alt?: string;
    className?: string;
}

const STORAGE_KEY = 'myflomo-images';

const LocalImage: React.FC<LocalImageProps> = ({ imageId, alt = '', className = '' }) => {
    const [imageData, setImageData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadImage = () => {
            try {
                const images = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                const image = images[imageId];

                if (image) {
                    setImageData(image);
                } else {
                    setError('图片未找到');
                }
            } catch (err) {
                setError('加载图片失败');
            } finally {
                setIsLoading(false);
            }
        };

        loadImage();
    }, [imageId]);

    if (isLoading) {
        return <div className="text-sm text-gray-500">加载中...</div>;
    }

    if (error) {
        return <div className="text-sm text-red-500">{error}</div>;
    }

    return (
        <img
            src={imageData || ''}
            alt={alt}
            className={`max-w-full h-auto ${className}`}
            loading="lazy"
        />
    );
};

export default LocalImage; 