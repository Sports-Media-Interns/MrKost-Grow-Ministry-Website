/**
 * Social media links shared across the home page and footer.
 */
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Twitch,
} from "lucide-react";
import { FlickrIcon, RedditIcon } from "@/components/ui/icons";

export const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/GrowMinistryInfo" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/growministryinfo/" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/grow-ministry/" },
  { icon: Twitter, label: "X / Twitter", href: "https://x.com/grow_ministry?s=21&t=th9tat1JPOeOeXiTvgrsxw" },
  { icon: FlickrIcon, label: "Flickr", href: "https://www.flickr.com/photos/201069901@N07" },
  { icon: RedditIcon, label: "Reddit", href: "https://www.reddit.com/user/GrowMinistry/" },
  { icon: Twitch, label: "Twitch", href: "https://www.twitch.tv/growministry" },
];
