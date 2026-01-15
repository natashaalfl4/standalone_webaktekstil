import Image from 'next/image';
import Link from 'next/link';
import { API_BASE_URL } from '@/utils/apiConfig';

interface LogoProps {
  src?: string | null;
}

const Logo: React.FC<LogoProps> = ({ src }) => {
  const fallback = 'https://ak-tekstilsolo.ac.id/wp-content/uploads/2018/07/cropped-header-1.jpg';

  // Build the final image source
  let imageSrc = fallback;
  if (src) {
    if (src.startsWith('http')) {
      // Already a full URL
      imageSrc = src;
    } else {
      // Relative path from backend, add API_BASE_URL and /storage/ if needed
      const cleanPath = src.startsWith('/') ? src : `/${src}`;
      if (cleanPath.startsWith('/storage/')) {
        imageSrc = `${API_BASE_URL}${cleanPath}`;
      } else {
        imageSrc = `${API_BASE_URL}/storage${cleanPath}`;
      }
    }
  }

  return (
    <Link href="/">
      <div className="flex items-center h-full">
        <Image
          src={imageSrc}
          alt="AK Tekstil Solo logo"
          width={250}
          height={100}
          className="h-24 w-auto object-contain rounded dark:mix-blend-screen dark:invert"
          quality={100}
        />
      </div>
    </Link>
  );
};

export default Logo;
