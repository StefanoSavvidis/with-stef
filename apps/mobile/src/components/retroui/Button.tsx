import { cva, type VariantProps } from "class-variance-authority";
import { useState, type ComponentProps } from "react";
import { ActivityIndicator, StyleSheet, type TextStyle } from "react-native";
import { Pressable, Text, View } from "@/tw";
import { cn } from "./cn";
import { fontSansSemiBold } from "@/lib/fonts";
import { HardShadow } from "./HardShadow";

export const buttonVariants = cva(
  "flex-row items-center justify-center rounded border-2 border-black",
  {
    variants: {
      variant: {
        default: "bg-[#ffdb33]",
        secondary: "bg-black",
        outline: "bg-white",
        link: "bg-transparent border-0",
        ghost: "bg-transparent border-0",
        destructive: "bg-[#e63946]",
      },
      size: {
        sm: "px-3 py-1",
        md: "px-4 py-2",
        lg: "px-6 py-3",
        icon: "p-2",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

// Explicit RN styles for button text
const textSizeStyles = StyleSheet.create({
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 18 },
  icon: { fontSize: 16 },
});

const pressStyles = StyleSheet.create({
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
});

const textVariantStyles: Record<string, TextStyle> = {
  default: { color: "#000", fontFamily: fontSansSemiBold },
  secondary: { color: "#fff", fontFamily: fontSansSemiBold },
  outline: { color: "#000", fontFamily: fontSansSemiBold },
  link: {
    color: "#000",
    fontFamily: fontSansSemiBold,
    textDecorationLine: "underline",
  },
  ghost: { color: "#000", fontFamily: fontSansSemiBold },
  destructive: { color: "#fff", fontFamily: fontSansSemiBold },
};

export interface ButtonProps
  extends
    Omit<ComponentProps<typeof Pressable>, "children">,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  size = "md",
  className,
  variant = "default",
  loading = false,
  disabled = false,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const textStyle = [
    textSizeStyles[size ?? "md"],
    textVariantStyles[variant ?? "default"],
  ];
  const [pressed, setPressed] = useState(false);

  const handlePressIn: ButtonProps["onPressIn"] = (event) => {
    setPressed(true);
    onPressIn?.(event);
  };

  const handlePressOut: ButtonProps["onPressOut"] = (event) => {
    setPressed(false);
    onPressOut?.(event);
  };

  return (
    <Pressable
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <HardShadow
        offset={pressed ? 0 : 4}
        radius={4}
        contentStyle={pressed ? pressStyles.pressed : undefined}
        containerClassName={className}
        className={cn(
          buttonVariants({ variant, size }),
          isDisabled && "opacity-50",
          className,
        )}
      >
        <View>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={variant === "default" ? "#000" : "#fff"}
            />
          ) : typeof children === "string" ? (
            <Text style={textStyle}>{children}</Text>
          ) : (
            children
          )}
        </View>
      </HardShadow>
    </Pressable>
  );
}
