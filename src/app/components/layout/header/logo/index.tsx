import Image from 'next/image';
import Link from 'next/link';
import { getImgPath } from '@/utils/pathUtils';

interface LogoProps {
  src?: string | null;
}

const Logo: React.FC<LogoProps> = ({ src }) => {
  const fallback = 'https://ak-tekstilsolo.ac.id/wp-content/uploads/2018/07/cropped-header-1.jpg';
  const imageSrc = src ?? fallback;

  return (
    <Link href="/">
      <div className="flex items-center h-full">
        <Image
          src={getImgPath(imageSrc)}
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