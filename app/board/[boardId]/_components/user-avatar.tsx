import { Hint } from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  name?: string;
  borderColor?: string;
}

export const UserAvatar = ({ name, src, borderColor }: UserAvatarProps) => {
  return (
    <Hint lablel={name || "anonymous"} side="bottom" sideOffset={18}>
      <Avatar
        className="rounded-full h-8 w-8"
        style={{
          borderWidth: 1,
          outline: `2px solid ${borderColor}`,
        }}
      >
        <AvatarFallback>
          {(name && name.slice(0, 2).toUpperCase()) || "A"}
        </AvatarFallback>
        <AvatarImage src={src} />
      </Avatar>
    </Hint>
  );
};
