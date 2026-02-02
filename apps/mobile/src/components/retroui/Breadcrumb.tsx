import type { ComponentProps } from "react"
import { Pressable, View, Text } from "@/tw"
import { cn } from "./cn"
import { Icon } from "./Icon"

export interface BreadcrumbProps extends ComponentProps<typeof View> {}

function BreadcrumbRoot({ className, children, ...props }: BreadcrumbProps) {
	return (
		<View className={cn("flex-row items-center gap-1", className)} {...props}>
			{children}
		</View>
	)
}

export interface BreadcrumbItemProps extends ComponentProps<typeof View> {}

function BreadcrumbItem({ className, children, ...props }: BreadcrumbItemProps) {
	return (
		<View className={cn("flex-row items-center gap-1", className)} {...props}>
			{children}
		</View>
	)
}

export interface BreadcrumbLinkProps extends Omit<ComponentProps<typeof Pressable>, "children"> {
	children?: React.ReactNode
}

function BreadcrumbLink({ className, children, ...props }: BreadcrumbLinkProps) {
	return (
		<Pressable className={cn(className)} {...props}>
			<Text className="text-sm text-muted-foreground">{children}</Text>
		</Pressable>
	)
}

function BreadcrumbPage({
	className,
	children,
	...props
}: ComponentProps<typeof View>) {
	return (
		<View className={cn(className)} {...props}>
			<Text className="text-sm font-medium text-foreground">{children}</Text>
		</View>
	)
}

function BreadcrumbSeparator({ className }: { className?: string }) {
	return (
		<View className={cn("px-1", className)}>
			<Icon name="chevron-right" size={14} color="#737373" />
		</View>
	)
}

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
	Item: BreadcrumbItem,
	Link: BreadcrumbLink,
	Page: BreadcrumbPage,
	Separator: BreadcrumbSeparator,
})
