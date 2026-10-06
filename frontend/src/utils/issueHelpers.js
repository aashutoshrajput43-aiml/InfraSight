export function formatCategory(type) {
  if (!type) return "Pothole";
  const map = {
    pothole: "Pothole",
    broken_streetlight: "Streetlight outage",
    overflowing_drain: "Blocked drain",
    garbage: "Overflowing bin",
    damaged_road: "Road damage",
    traffic_signal: "Traffic signal malfunction",
    water_pipeline: "Burst water pipeline",
    open_manhole: "Uncovered sewer manhole",
    footpath: "Damaged footpath",
  };
  const key = type.toLowerCase().replace(/ /g, "_");
  return map[key] || type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getPhotoForType(type, imgUrl) {
  if (imgUrl && !imgUrl.includes("sample_")) {
    return imgUrl.startsWith("http") ? imgUrl : `http://127.0.0.1:8000${imgUrl}`;
  }
  const photos = {
    pothole: "/pothole.jpg",
    broken_streetlight: "/streetlight.jpg",
    overflowing_drain: "/drain.jpg",
    garbage: "/garbage.jpg",
    damaged_road: "/footpath.jpg",
    traffic_signal: "/traffic_signal.jpg",
    water_pipeline: "/pipeline.jpg",
    open_manhole: "/manhole.jpg",
    footpath: "/footpath.jpg",
  };
  const key = (type || "").toLowerCase().replace(/ /g, "_");
  return photos[key] || "/pothole.jpg";
}

export function getDepartmentForType(type) {
  const map = {
    pothole: "Roads Department",
    broken_streetlight: "Electrical Wing",
    overflowing_drain: "Drainage Dept",
    garbage: "Waste Management",
    damaged_road: "Civil Works",
    traffic_signal: "Traffic & Electrical Cell",
    water_pipeline: "Indore Water Supply Wing",
    open_manhole: "Sewerage & Drainage Dept",
    footpath: "Civil Works",
  };
  const key = (type || "").toLowerCase().replace(/ /g, "_");
  return map[key] || "Municipal Operations";
}

export function getPrioBadge(score) {
  if (score >= 80) return "bg-red-50 text-red-700 border-red-200";
  if (score >= 65) return "bg-orange-50 text-orange-700 border-orange-200";
  if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

export function getPrioLevel(score) {
  if (score >= 80) return "Critical";
  if (score >= 65) return "High";
  if (score >= 50) return "Medium";
  return "Low";
}
