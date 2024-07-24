import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const TollBar = () => {
  return (
    <section className="w-full flex items-center justify-center py-8 px-6 bg-secondary rounded-xl">
      <div className="w-full flex items-center space-x-8">
        <Select>
          <SelectTrigger className="w-96">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Ad-Hoc</Label>
        </div>
      </div>
      <div>
        <Button className="rounded-3xl bg-primarygreen w-32 font-bold shadow-md shadow-secondary-foreground">
          <span>Optimize</span>
        </Button>
      </div>
    </section>
  );
};

export default TollBar;
