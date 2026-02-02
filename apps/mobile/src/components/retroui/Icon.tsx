import { Ionicons } from "@expo/vector-icons"
import type { ComponentProps } from "react"

type IoniconsName = ComponentProps<typeof Ionicons>["name"]

// Map common icon names to Ionicons equivalents
const iconMap: Record<string, IoniconsName> = {
	"chevron-down": "chevron-down",
	"chevron-up": "chevron-up",
	"chevron-left": "chevron-back",
	"chevron-right": "chevron-forward",
	check: "checkmark",
	x: "close",
	close: "close",
	"more-horizontal": "ellipsis-horizontal",
	"more-vertical": "ellipsis-vertical",
	"alert-circle": "alert-circle",
	info: "information-circle",
	"check-circle": "checkmark-circle",
	warning: "warning",
	search: "search",
	plus: "add",
	minus: "remove",
	edit: "pencil",
	trash: "trash",
	settings: "settings",
	user: "person",
	home: "home",
	menu: "menu",
	"arrow-left": "arrow-back",
	"arrow-right": "arrow-forward",
	"external-link": "open-outline",
	copy: "copy",
	eye: "eye",
	"eye-off": "eye-off",
	lock: "lock-closed",
	unlock: "lock-open",
	mail: "mail",
	calendar: "calendar",
	clock: "time",
	star: "star",
	heart: "heart",
	bookmark: "bookmark",
	share: "share",
	download: "download",
	upload: "cloud-upload",
	refresh: "refresh",
	filter: "filter",
	sort: "swap-vertical",
	grid: "grid",
	list: "list",
	image: "image",
	camera: "camera",
	mic: "mic",
	volume: "volume-high",
	"volume-off": "volume-mute",
	play: "play",
	pause: "pause",
	stop: "stop",
	"skip-forward": "play-skip-forward",
	"skip-back": "play-skip-back",
	wifi: "wifi",
	bluetooth: "bluetooth",
	battery: "battery-full",
	trophy: "trophy",
	location: "location",
	map: "map",
	compass: "compass",
	sun: "sunny",
	moon: "moon",
	cloud: "cloud",
}

export interface IconProps extends Omit<ComponentProps<typeof Ionicons>, "name"> {
	name: string
	size?: number
	color?: string
}

export function Icon({ name, size = 24, color = "black", ...props }: IconProps) {
	const ionName = iconMap[name] || (name as IoniconsName)
	return <Ionicons name={ionName} size={size} color={color} {...props} />
}
