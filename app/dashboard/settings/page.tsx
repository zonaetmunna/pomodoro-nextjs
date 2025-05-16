"use client";

import { AuthenticatedHeader } from "@/components/authenticated-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, Slash, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Settings {
  pomodoroLength: number;
  shortBreakLength: number;
  longBreakLength: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  darkMode: boolean;
}

export default function SettingsPage() {
  const [userName, setUserName] = useState("User");
  const [settings, setSettings] = useState<Settings>({
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true,
    soundVolume: 50,
    darkMode: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user data
        const userResponse = await fetch("/api/user");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserName(userData.name);
        }
        
        // Fetch settings
        const settingsResponse = await fetch("/api/settings");
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setSettings(settingsData);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const updateSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNumberChange = (field: keyof Settings, value: string) => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue)) {
      setSettings({ ...settings, [field]: numberValue });
    }
  };

  const handleToggleChange = (field: keyof Settings, value: boolean) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSliderChange = (value: number[]) => {
    setSettings({ ...settings, soundVolume: value[0] });
  };

  return (
    <div className="min-h-screen bg-black">
      <AuthenticatedHeader userName={userName} />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-400">
              Customize your Pomodoro timer and application preferences.
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading settings...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {/* Timer Settings */}
              <Card className="bg-black border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Timer Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your Pomodoro timer durations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="pomodoroLength">Pomodoro Length (minutes)</Label>
                      <Input
                        id="pomodoroLength"
                        type="number"
                        min={1}
                        max={120}
                        value={settings.pomodoroLength}
                        onChange={(e) => handleNumberChange('pomodoroLength', e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="shortBreakLength">Short Break Length (minutes)</Label>
                      <Input
                        id="shortBreakLength"
                        type="number"
                        min={1}
                        max={30}
                        value={settings.shortBreakLength}
                        onChange={(e) => handleNumberChange('shortBreakLength', e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="longBreakLength">Long Break Length (minutes)</Label>
                      <Input
                        id="longBreakLength"
                        type="number"
                        min={1}
                        max={60}
                        value={settings.longBreakLength}
                        onChange={(e) => handleNumberChange('longBreakLength', e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="longBreakInterval">
                        Long Break Interval (pomodoros)
                      </Label>
                      <Input
                        id="longBreakInterval"
                        type="number"
                        min={1}
                        max={10}
                        value={settings.longBreakInterval}
                        onChange={(e) => handleNumberChange('longBreakInterval', e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Automation Settings */}
              <Card className="bg-black border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Automation Settings
                  </CardTitle>
                  <CardDescription>
                    Configure auto-start behaviors and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoStartBreaks">Auto-start Breaks</Label>
                      <p className="text-sm text-gray-500">
                        Automatically start breaks when a Pomodoro finishes
                      </p>
                    </div>
                    <Switch
                      id="autoStartBreaks"
                      checked={settings.autoStartBreaks}
                      onCheckedChange={(value) => handleToggleChange('autoStartBreaks', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoStartPomodoros">Auto-start Pomodoros</Label>
                      <p className="text-sm text-gray-500">
                        Automatically start a new Pomodoro when a break finishes
                      </p>
                    </div>
                    <Switch
                      id="autoStartPomodoros"
                      checked={settings.autoStartPomodoros}
                      onCheckedChange={(value) => handleToggleChange('autoStartPomodoros', value)}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Sound Settings */}
              <Card className="bg-black border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {settings.soundEnabled ? (
                      <Volume2 className="h-5 w-5" />
                    ) : (
                      <VolumeX className="h-5 w-5" />
                    )}
                    Sound Settings
                  </CardTitle>
                  <CardDescription>
                    Configure notification sounds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="soundEnabled">Enable Sounds</Label>
                      <p className="text-sm text-gray-500">
                        Play a sound when timer finishes
                      </p>
                    </div>
                    <Switch
                      id="soundEnabled"
                      checked={settings.soundEnabled}
                      onCheckedChange={(value) => handleToggleChange('soundEnabled', value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="soundVolume">Sound Volume</Label>
                      <span className="text-sm text-gray-400">{settings.soundVolume}%</span>
                    </div>
                    <Slider
                      id="soundVolume"
                      disabled={!settings.soundEnabled}
                      value={[settings.soundVolume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleSliderChange}
                      className={!settings.soundEnabled ? "opacity-50" : ""}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Display Settings */}
              <Card className="bg-black border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Slash className="h-5 w-5" />
                    Display Settings
                  </CardTitle>
                  <CardDescription>
                    Configure appearance preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Dark Theme</Label>
                      <p className="text-sm text-gray-500">
                        Use dark theme for the application
                      </p>
                    </div>
                    <Switch
                      id="darkMode"
                      checked={settings.darkMode}
                      onCheckedChange={(value) => handleToggleChange('darkMode', value)}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90"
                size="lg"
                disabled={isSaving}
                onClick={updateSettings}
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 