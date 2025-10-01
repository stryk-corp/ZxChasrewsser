'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { Slider } from '../ui/slider';

const borderStyles = [
    { id: 'none', name: 'None' },
    { id: 'solid', name: 'Solid' },
    { id: 'double', name: 'Double' },
    { id: 'dotted', name: 'Dotted' },
    { id: 'dashed', name: 'Dashed' },
    { id: 'groove', name: 'Groove' },
];

const fontOptions = [
    { name: 'Literata', family: "'Literata', serif" },
    { name: 'Inter', family: "'Inter', sans-serif" },
    { name: 'Roboto', family: "'Roboto', sans-serif" },
    { name: 'Merriweather', family: "'Merriweather', serif" },
    { name: 'Source Code Pro', family: "'Source Code Pro', monospace" },
    { name: 'Playfair Display', family: "'Playfair Display', serif" },
]

export function Step5() {
  const { control, watch } = useFormContext();
  const selectedBorder = watch('pageBorder');
  const fontSize = watch('fontSize');
  const lineSpacing = watch('lineSpacing');

  return (
    <div className="space-y-10">
        {/* Page Layout Section */}
        <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">Page Layout</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <FormField
                        control={control}
                        name="pageBorder"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Page Border Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a border style" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {borderStyles.map(style => (
                                    <SelectItem key={style.id} value={style.id}>{style.name}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormDescription>Choose a decorative border for your pages.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    {selectedBorder !== 'none' && (
                        <FormField
                            control={control}
                            name="pageBorderScope"
                            render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Apply Border To</FormLabel>
                                <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center gap-6"
                                >
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="all" id="scope-all" />
                                        </FormControl>
                                        <Label htmlFor="scope-all">All Pages</Label>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="cover" id="scope-cover" />
                                        </FormControl>
                                        <Label htmlFor="scope-cover">Cover Page Only</Label>
                                    </FormItem>
                                </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    )}
                </div>

                <div className="space-y-6">
                    <FormField
                    control={control}
                    name="pageNumberAlign"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Page Number Alignment</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select alignment" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription>Position of the page numbers.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Separator />
                    <FormField
                    control={control}
                    name="includeTOC"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            Include Table of Contents
                            </FormLabel>
                            <FormDescription>
                            Generate a table of contents page after the acknowledgements.
                            </FormDescription>
                        </div>
                        </FormItem>
                    )}
                    />
                </div>
            </div>
        </div>
        
        <Separator />

        {/* Typography Section */}
        <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">Typography</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={control}
                    name="fontHeading"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Heading Font</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger style={{fontFamily: fontOptions.find(f => f.name === field.value)?.family}}>
                                    <SelectValue placeholder="Select a font" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {fontOptions.map((font) => (
                                <SelectItem key={font.name} value={font.name} style={{fontFamily: font.family}}>
                                    {font.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="fontBody"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Body Font</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger style={{fontFamily: fontOptions.find(f => f.name === field.value)?.family}}>
                                    <SelectValue placeholder="Select a font" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {fontOptions.map((font) => (
                                <SelectItem key={font.name} value={font.name} style={{fontFamily: font.family}}>
                                    {font.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="fontSize"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Font Size: <span className="text-primary font-bold">{fontSize}pt</span></FormLabel>
                            <FormControl>
                                <Slider 
                                    min={10} 
                                    max={18} 
                                    step={1}
                                    defaultValue={[field.value]} 
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="lineSpacing"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Line Spacing: <span className="text-primary font-bold">{lineSpacing.toFixed(2)}</span></FormLabel>
                            <FormControl>
                                <Slider 
                                    min={1.2} 
                                    max={2.5} 
                                    step={0.05}
                                    defaultValue={[field.value]} 
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    </div>
  );
}
