import logoImage from 'figma:asset/e02ec7aaf59540adf8f01e5649ea49ce55024764.png';

export function MascotIcon({ className }: { className?: string }) {
  return (
    <img
      src={logoImage}
      alt="FoodPapa Logo"
      className={className}
    />
  );
}
