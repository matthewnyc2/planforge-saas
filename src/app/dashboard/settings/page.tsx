"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Save, Loader2, User, Lock, Bell, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    if (session?.user) {
      setProfile({ name: session.user.name || "", email: session.user.email || "" });
    }
  }, [session]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (res.ok) {
      setMessage("Profile updated successfully!");
      update();
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to update profile");
    }
    setSaving(false);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
    });
    if (res.ok) {
      setMessage("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to change password");
    }
    setSaving(false);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-xl text-sm ${message.includes("success") ? "bg-secondary/5 text-secondary" : "bg-destructive/5 text-destructive"}`}>
          {message}
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg font-display">Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-5">
            <div className="flex items-center gap-4 mb-5">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-display">
                  {profile.name ? getInitials(profile.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{profile.name || "User"}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium">Full Name</Label>
              <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">Email</Label>
              <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="rounded-xl" />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg font-display">Password</CardTitle>
              <CardDescription>Change your account password</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={changePassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="font-medium">Current Password</Label>
              <Input id="currentPassword" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="font-medium">New Password</Label>
              <Input id="newPassword" type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={6} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-medium">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required minLength={6} className="rounded-xl" />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg font-display">Notifications</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {[
              { label: "Email notifications", desc: "Receive email updates about your projects" },
              { label: "Task assignments", desc: "Get notified when tasks are assigned to you" },
              { label: "Project updates", desc: "Receive updates when project status changes" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-transparent after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg font-display">Appearance</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="font-medium">Theme</Label>
            <div className="flex gap-3">
              {["Light", "Dark", "System"].map((theme) => (
                <button key={theme} className={`px-4 py-2 rounded-full text-sm transition-all ${theme === "Light" ? "gradient-primary text-white shadow-md shadow-primary/20" : "ghost-border hover:bg-muted/60"}`}>
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
