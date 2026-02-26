import Image from 'next/image';

interface InfoItemProps {
  icon: string;
  alt: string;
  label: string;
  value: string;
}

export const InfoItem = ({ icon, alt, label, value }: InfoItemProps) => {
  return (
    <div>
      <div className="my-1 flex items-center gap-1.5">
        <Image
          src={icon}
          alt={alt}
          width={21}
          height={18}
        />
        <p className="font-label-normal text-gray-8">{label}</p>
      </div>
      <p className="font-body2-heading text-gray-12">{value}</p>
    </div>
  );
};
