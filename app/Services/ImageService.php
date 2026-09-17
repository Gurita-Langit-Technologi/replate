<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Simpan dan optimasi gambar ke disk publik
     * Jika ekstensi GD mendukung webp, konversi ke WebP untuk kompresi optimal.
     */
    public function storeOptimized(UploadedFile $file, string $folder = 'products', int $maxWidth = 1200, int $quality = 80): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = Str::random(40);

        // Jika ekstensi GD tersedia dan file bertipe image umum
        if (function_exists('imagecreatefromstring') && function_exists('imagewebp') && in_array($extension, ['jpg', 'jpeg', 'png', 'webp'])) {
            try {
                $imageContent = file_get_contents($file->getRealPath());
                $src = @imagecreatefromstring($imageContent);

                if ($src !== false) {
                    $width = imagesx($src);
                    $height = imagesy($src);

                    // Resize proporsional jika lebih besar dari maxWidth
                    if ($width > $maxWidth) {
                        $newWidth = $maxWidth;
                        $newHeight = (int) round(($height / $width) * $maxWidth);

                        $dst = imagecreatetruecolor($newWidth, $newHeight);
                        
                        // Handle transparansi untuk PNG
                        imagealphablending($dst, false);
                        imagesavealpha($dst, true);

                        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                        imagedestroy($src);
                        $src = $dst;
                    }

                    // Simpan sebagai WebP di output buffer
                    ob_start();
                    imagewebp($src, null, $quality);
                    $optimizedData = ob_get_clean();
                    imagedestroy($src);

                    $path = "{$folder}/{$filename}.webp";
                    Storage::disk('public')->put($path, $optimizedData);
                    return $path;
                }
            } catch (\Throwable $e) {
                // Fallback ke penyimpanan default jika terjadi error pada GD
            }
        }

        // Fallback default
        return $file->store($folder, 'public');
    }

    /**
     * Simpan media (gambar atau video) ke disk publik.
     * Jika gambar, dilakukan kompresi/optimasi. Jika video, disimpan langsung.
     */
    public function storeMedia(UploadedFile $file, string $folder = 'reports', int $maxWidth = 1200, int $quality = 80): string
    {
        $mime = $file->getMimeType();
        $extension = strtolower($file->getClientOriginalExtension());

        if (str_starts_with($mime, 'video/') || in_array($extension, ['mp4', 'webm', 'mov', 'ogg', 'mkv'])) {
            return $file->store($folder, 'public');
        }

        return $this->storeOptimized($file, $folder, $maxWidth, $quality);
    }
}
