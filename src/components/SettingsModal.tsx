import { useState } from "react";
import { useSettings } from "../hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();

  // Local state for settings (only saved on Save button click)
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    toast.success("Settings saved successfully");
    onClose();
  };

  const handleCancel = () => {
    // Reset local settings to discard changes
    setLocalSettings(settings);
    onClose();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset local settings when closing without saving
      setLocalSettings(settings);
      onClose();
    } else {
      // Reset local settings to current settings when opening
      setLocalSettings(settings);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[85vh] sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription>Customize your weather experience</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto px-1">
          {/* Temperature Unit Card */}
          <Card>
            <CardHeader>
              <CardTitle>Temperature Unit</CardTitle>
              <CardDescription>Choose your preferred temperature scale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    setLocalSettings({ ...localSettings, units: { temperature: "celsius" } })
                  }
                  variant={localSettings.units.temperature === "celsius" ? "default" : "outline"}
                  className={`flex-1 ${localSettings.units.temperature === "celsius" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                >
                  Celsius (°C)
                </Button>
                <Button
                  onClick={() =>
                    setLocalSettings({ ...localSettings, units: { temperature: "fahrenheit" } })
                  }
                  variant={localSettings.units.temperature === "fahrenheit" ? "default" : "outline"}
                  className={`flex-1 ${localSettings.units.temperature === "fahrenheit" ? "bg-linear-to-r bg-blue-500 hover:bg-blue-600" : ""}`}
                >
                  Fahrenheit (°F)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Weather Data Card */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Weather Data</CardTitle>
              <CardDescription>
                Select which additional weather information to display
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { key: "showUVIndex", label: "UV Index" },
                  { key: "showSunriseSunset", label: "Sunrise & Sunset" },
                  { key: "showHumidity", label: "Humidity" },
                  { key: "showFeelsLike", label: "Feels Like Temperature" },
                  { key: "showPressure", label: "Atmospheric Pressure" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <span className="font-medium text-gray-800">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={
                        localSettings.weatherData[
                          item.key as keyof typeof localSettings.weatherData
                        ]
                      }
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          weatherData: {
                            ...localSettings.weatherData,
                            [item.key]: e.target.checked,
                          },
                        })
                      }
                      className="w-6 h-6 rounded accent-blue-600 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
