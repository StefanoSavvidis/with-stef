import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Bold, Italic, Underline } from "lucide-react"
import {
	Accordion,
	Alert,
	Avatar,
	Badge,
	Breadcrumb,
	Button,
	Card,
	Checkbox,
	Dialog,
	Drawer,
	Input,
	Label,
	Menu,
	Popover,
	Progress,
	RadioGroup,
	Select,
	Slider,
	Switch,
	Tabs,
	TabsPanels,
	TabsTrigger,
	TabsContent,
	TabsTriggerList,
	Table,
	Text,
	Textarea,
	Toggle,
	ToggleGroup,
	Tooltip,
} from "@/components/retroui"
import { ToggleGroupItem } from "@/components/retroui/ToggleGroup"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_dashboard/admin/playground")({
	component: PlaygroundPage,
})

const PALETTES = [
	{
		key: "default",
		label: "Default",
		colors: ["#ffdb33", "#fae583", "#fff", "#000"],
	},
	{
		key: "ocean",
		label: "Ocean",
		colors: ["#0ea5e9", "#bae6fd", "#f0f9ff", "#0c4a6e"],
	},
	{
		key: "forest",
		label: "Forest",
		colors: ["#22c55e", "#bbf7d0", "#f0fdf4", "#14532d"],
	},
	{
		key: "sunset",
		label: "Sunset",
		colors: ["#f97316", "#fed7aa", "#fff7ed", "#7c2d12"],
	},
	{
		key: "midnight",
		label: "Midnight",
		colors: ["#a78bfa", "#4c3f82", "#1e1b2e", "#4c3f82"],
	},
]

function PlaygroundPage() {
	const [activeTheme, setActiveTheme] = useState("default")

	return (
		<div className="space-y-6">
			<Text as="h1">Component Playground</Text>

			{/* Palette selector — outside scoped area */}
			<div className="flex flex-wrap gap-3">
				{PALETTES.map((palette) => (
					<button
						key={palette.key}
						type="button"
						onClick={() => setActiveTheme(palette.key)}
						className={cn(
							"flex items-center gap-2 px-4 py-2 border-2 border-border font-head text-sm transition-all",
							activeTheme === palette.key
								? "ring-2 ring-offset-2 ring-border bg-accent"
								: "hover:bg-accent/50",
						)}
					>
						<span className="flex gap-1">
							{palette.colors.map((color) => (
								<span
									key={color}
									className="w-3 h-3 border border-black/20"
									style={{ backgroundColor: color }}
								/>
							))}
						</span>
						{palette.label}
					</button>
				))}
			</div>

			{/* Scoped preview area */}
			<div
				{...(activeTheme !== "default" ? { "data-theme": activeTheme } : {})}
				className="bg-background text-foreground border-2 border-border rounded p-6 space-y-10"
			>
				<TypographySection />
				<ButtonsSection />
				<FormInputsSection />
				<DataDisplaySection />
				<FeedbackSection />
				<OverlayTriggersSection />
				<NavigationLayoutSection />
			</div>
		</div>
	)
}

function SectionHeading({ children }: { children: React.ReactNode }) {
	return (
		<Text as="h2" className="border-b-2 border-border pb-2 mb-4">
			{children}
		</Text>
	)
}

function TypographySection() {
	return (
		<section>
			<SectionHeading>Typography</SectionHeading>
			<div className="space-y-3">
				<Text as="h1">Heading 1</Text>
				<Text as="h2">Heading 2</Text>
				<Text as="h3">Heading 3</Text>
				<Text as="h4">Heading 4</Text>
				<Text as="p">
					This is a paragraph of body text. It demonstrates how regular content
					looks with the current palette applied.
				</Text>
				<Text as="p" className="text-muted-foreground">
					This is muted text for secondary information.
				</Text>
			</div>
		</section>
	)
}

function ButtonsSection() {
	return (
		<section>
			<SectionHeading>Buttons</SectionHeading>
			<div className="flex flex-wrap gap-3">
				<Button>Default</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="link">Link</Button>
				<Button variant="ghost">Ghost</Button>
				<Button disabled>Disabled</Button>
			</div>
		</section>
	)
}

function FormInputsSection() {
	return (
		<section>
			<SectionHeading>Form Inputs</SectionHeading>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label>Text Input</Label>
					<Input placeholder="Type something..." />
				</div>
				<div className="space-y-2">
					<Label>Invalid Input</Label>
					<Input
						placeholder="Invalid value"
						aria-invalid="true"
						className="border-destructive"
					/>
				</div>
				<div className="space-y-2 md:col-span-2">
					<Label>Textarea</Label>
					<Textarea placeholder="Write a longer message..." rows={3} />
				</div>
				<div className="flex items-center gap-2">
					<Checkbox id="check-demo" />
					<Label htmlFor="check-demo">Checkbox label</Label>
				</div>
				<div className="space-y-2">
					<Label>Radio Group</Label>
					<RadioGroup defaultValue="a">
						<div className="flex items-center gap-2">
							<RadioGroup.Item value="a" id="radio-a" />
							<Label htmlFor="radio-a">Option A</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroup.Item value="b" id="radio-b" />
							<Label htmlFor="radio-b">Option B</Label>
						</div>
					</RadioGroup>
				</div>
				<div className="flex items-center gap-2">
					<Switch id="switch-demo" />
					<Label htmlFor="switch-demo">Switch toggle</Label>
				</div>
				<div className="space-y-2">
					<Label>Select</Label>
					<Select>
						<Select.Trigger className="w-full">
							<Select.Value placeholder="Choose an option" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="one">Option One</Select.Item>
							<Select.Item value="two">Option Two</Select.Item>
							<Select.Item value="three">Option Three</Select.Item>
						</Select.Content>
					</Select>
				</div>
				<div className="space-y-2 md:col-span-2">
					<Label>Slider</Label>
					<Slider defaultValue={[50]} max={100} step={1} />
				</div>
			</div>
		</section>
	)
}

function DataDisplaySection() {
	return (
		<section>
			<SectionHeading>Data Display</SectionHeading>
			<div className="space-y-6">
				{/* Card */}
				<Card className="block w-full">
					<Card.Header>
						<Card.Title>Card Title</Card.Title>
						<Card.Description>
							This is a card description showing secondary information.
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<Text as="p">Card body content goes here.</Text>
					</Card.Content>
				</Card>

				{/* Badges */}
				<div className="flex flex-wrap gap-2">
					<Badge>Default</Badge>
					<Badge variant="outline">Outline</Badge>
					<Badge variant="solid">Solid</Badge>
					<Badge variant="surface">Surface</Badge>
				</div>

				{/* Table */}
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head>Score</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<Table.Row>
							<Table.Cell>Alice</Table.Cell>
							<Table.Cell>Active</Table.Cell>
							<Table.Cell>95</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Bob</Table.Cell>
							<Table.Cell>Pending</Table.Cell>
							<Table.Cell>82</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Charlie</Table.Cell>
							<Table.Cell>Inactive</Table.Cell>
							<Table.Cell>67</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>

				{/* Avatar */}
				<div className="flex items-center gap-3">
					<Avatar>
						<Avatar.Fallback>AB</Avatar.Fallback>
					</Avatar>
					<Avatar>
						<Avatar.Fallback>CD</Avatar.Fallback>
					</Avatar>
					<Avatar>
						<Avatar.Fallback>EF</Avatar.Fallback>
					</Avatar>
				</div>

				{/* Progress */}
				<div className="space-y-3">
					<Progress value={25} />
					<Progress value={50} />
					<Progress value={75} />
				</div>
			</div>
		</section>
	)
}

function FeedbackSection() {
	return (
		<section>
			<SectionHeading>Feedback</SectionHeading>
			<div className="space-y-3">
				<Alert status="error">
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>Something went wrong.</Alert.Description>
				</Alert>
				<Alert status="success">
					<Alert.Title>Success</Alert.Title>
					<Alert.Description>Operation completed.</Alert.Description>
				</Alert>
				<Alert status="warning">
					<Alert.Title>Warning</Alert.Title>
					<Alert.Description>Please review before continuing.</Alert.Description>
				</Alert>
				<Alert status="info">
					<Alert.Title>Info</Alert.Title>
					<Alert.Description>
						Here is some additional context.
					</Alert.Description>
				</Alert>
			</div>
		</section>
	)
}

function OverlayTriggersSection() {
	return (
		<section>
			<SectionHeading>Overlay Triggers</SectionHeading>
			<Text as="p" className="text-muted-foreground text-sm mb-4">
				Portaled overlay content uses the global theme, not the scoped preview.
			</Text>
			<div className="flex flex-wrap gap-3">
				{/* Dialog */}
				<Dialog>
					<Dialog.Trigger asChild>
						<Button variant="outline">Open Dialog</Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>Dialog Title</Dialog.Header>
						<Dialog.Description>
							This is a dialog with some example content.
						</Dialog.Description>
						<Dialog.Footer>
							<Button variant="outline">Cancel</Button>
							<Button>Confirm</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog>

				{/* Popover */}
				<Popover>
					<Popover.Trigger asChild>
						<Button variant="outline">Open Popover</Button>
					</Popover.Trigger>
					<Popover.Content>
						<Text as="p" className="text-sm">
							Popover content here.
						</Text>
					</Popover.Content>
				</Popover>

				{/* Tooltip */}
				<Tooltip.Provider>
					<Tooltip>
						<Tooltip.Trigger asChild>
							<Button variant="outline">Hover for Tooltip</Button>
						</Tooltip.Trigger>
						<Tooltip.Content>Tooltip text</Tooltip.Content>
					</Tooltip>
				</Tooltip.Provider>

				{/* Menu */}
				<Menu>
					<Menu.Trigger asChild>
						<Button variant="outline">Open Menu</Button>
					</Menu.Trigger>
					<Menu.Content>
						<Menu.Item>Item One</Menu.Item>
						<Menu.Item>Item Two</Menu.Item>
						<Menu.Item>Item Three</Menu.Item>
					</Menu.Content>
				</Menu>

				{/* Drawer */}
				<Drawer>
					<Drawer.Trigger asChild>
						<Button variant="outline">Open Drawer</Button>
					</Drawer.Trigger>
					<Drawer.Content>
						<Drawer.Header>
							<Drawer.Title>Drawer Title</Drawer.Title>
							<Drawer.Description>
								Drawer description content.
							</Drawer.Description>
						</Drawer.Header>
						<div className="p-4">
							<Text as="p">Drawer body content.</Text>
						</div>
					</Drawer.Content>
				</Drawer>
			</div>
		</section>
	)
}

function NavigationLayoutSection() {
	return (
		<section>
			<SectionHeading>Navigation & Layout</SectionHeading>
			<div className="space-y-6">
				{/* Accordion */}
				<div>
					<Text as="h4" className="mb-2">
						Accordion
					</Text>
					<Accordion type="single" collapsible>
						<Accordion.Item value="item-1">
							<Accordion.Header>First Item</Accordion.Header>
							<Accordion.Content>
								Content for the first accordion item.
							</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value="item-2">
							<Accordion.Header>Second Item</Accordion.Header>
							<Accordion.Content>
								Content for the second accordion item.
							</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value="item-3">
							<Accordion.Header>Third Item</Accordion.Header>
							<Accordion.Content>
								Content for the third accordion item.
							</Accordion.Content>
						</Accordion.Item>
					</Accordion>
				</div>

				{/* Tabs */}
				<div>
					<Text as="h4" className="mb-2">
						Tabs
					</Text>
					<Tabs>
						<TabsTriggerList>
							<TabsTrigger>Tab One</TabsTrigger>
							<TabsTrigger>Tab Two</TabsTrigger>
							<TabsTrigger>Tab Three</TabsTrigger>
						</TabsTriggerList>
						<TabsPanels>
							<TabsContent>Content for tab one.</TabsContent>
							<TabsContent>Content for tab two.</TabsContent>
							<TabsContent>Content for tab three.</TabsContent>
						</TabsPanels>
					</Tabs>
				</div>

				{/* Breadcrumb */}
				<div>
					<Text as="h4" className="mb-2">
						Breadcrumb
					</Text>
					<Breadcrumb>
						<Breadcrumb.List>
							<Breadcrumb.Item>
								<Breadcrumb.Link href="#">Home</Breadcrumb.Link>
							</Breadcrumb.Item>
							<Breadcrumb.Separator />
							<Breadcrumb.Item>
								<Breadcrumb.Link href="#">Admin</Breadcrumb.Link>
							</Breadcrumb.Item>
							<Breadcrumb.Separator />
							<Breadcrumb.Item>
								<Breadcrumb.Page>Playground</Breadcrumb.Page>
							</Breadcrumb.Item>
						</Breadcrumb.List>
					</Breadcrumb>
				</div>

				{/* Toggle & ToggleGroup */}
				<div>
					<Text as="h4" className="mb-2">
						Toggle & ToggleGroup
					</Text>
					<div className="flex flex-wrap gap-3">
						<Toggle variant="outlined" aria-label="Toggle bold">
							<Bold className="h-4 w-4" />
						</Toggle>
						<ToggleGroup type="multiple" variant="outlined">
							<ToggleGroupItem value="bold" aria-label="Toggle bold">
								<Bold className="h-4 w-4" />
							</ToggleGroupItem>
							<ToggleGroupItem value="italic" aria-label="Toggle italic">
								<Italic className="h-4 w-4" />
							</ToggleGroupItem>
							<ToggleGroupItem
								value="underline"
								aria-label="Toggle underline"
							>
								<Underline className="h-4 w-4" />
							</ToggleGroupItem>
						</ToggleGroup>
					</div>
				</div>
			</div>
		</section>
	)
}
