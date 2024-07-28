import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function GanttChart({ title, data, timeLabels }) {
    return (
        <div className="grid grid-cols-1 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className={`relative h-8 bg-gray-200`}
                                style={{ width: `${item.width}%` }}
                            >
                                {item.colors.map((color, colorIndex) => (
                                    <div
                                        key={colorIndex}
                                        className={`absolute left-[${color.position}%] h-full w-[${color.width}%] bg-${color.color}`}
                                    />
                                ))}
                                {index !== data.length - 1 && (
                                    <div className="absolute inset-y-0 w-px bg-muted-foreground/20 left-[0%]" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        {/* {timeLabels.map((label, index) => (
                            <span key={index}>{label}</span>
                        ))} */}
                        <span>00:00</span>
                        <span>02:00</span>
                        <span>04:00</span>
                        <span>06:00</span>
                        <span>08:00</span>
                        <span>10:00</span>
                        <span>12:00</span>
                        <span>14:00</span>
                        <span>16:00</span>
                        <span>18:00</span>
                        <span>20:00</span>
                        <span>22:00</span>
                        <span>24:00</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
