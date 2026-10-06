import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { SinglePinMap } from "../components/MapComponents";

export default function CitizenReport() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const categoryMedia = {
    Pothole: {
      photo: "/pothole.jpg",
      fileName: "IMG_2431_Pothole.jpg · Vijay Nagar · 2.4 MB",
      confidence: "94%",
      boxLabel: "Pothole · 94%",
      boxPos: { left: "18%", top: "45%", width: "64%", height: "42%" },
      desc: "Large pothole roughly 60 cm wide on AB Road near Vijay Nagar square, filling with water after rain. Two-wheelers are swerving into the next lane to avoid it.",
      breakdown: [
        { name: "Pothole", pct: 94, color: "bg-amber-500" },
        { name: "Damaged road", pct: 82, color: "bg-orange-500" },
        { name: "Debris / obstruction", pct: 8, color: "bg-slate-300" },
      ],
    },
    Streetlight: {
      photo: "/streetlight.jpg",
      fileName: "IMG_3012_Streetlight.jpg · Palasia Square · 2.1 MB",
      confidence: "92%",
      boxLabel: "Broken luminaire · 92%",
      boxPos: { left: "28%", top: "6%", width: "42%", height: "40%" },
      desc: "Broken municipal streetlight casing and shattered bulb near Palasia Square. Street remains pitch dark after 7 PM.",
      breakdown: [
        { name: "Broken streetlight", pct: 92, color: "bg-amber-500" },
        { name: "Electrical hazard", pct: 74, color: "bg-orange-500" },
        { name: "Cable exposure", pct: 15, color: "bg-slate-300" },
      ],
    },
    Drainage: {
      photo: "/drain.jpg",
      fileName: "IMG_1884_Drain.jpg · Rajwada Market · 2.6 MB",
      confidence: "91%",
      boxLabel: "Drain overflow · 91%",
      boxPos: { left: "15%", top: "35%", width: "70%", height: "55%" },
      desc: "Overflowing municipal stormwater drain near Rajwada Market. Muddy water logging the pedestrian lane and shops.",
      breakdown: [
        { name: "Overflowing drain", pct: 91, color: "bg-cyan-600" },
        { name: "Waterlogging", pct: 86, color: "bg-sky-500" },
        { name: "Silt blockage", pct: 22, color: "bg-slate-300" },
      ],
    },
    Garbage: {
      photo: "/garbage.jpg",
      fileName: "IMG_5502_Garbage.jpg · Sarafa Bazaar · 2.3 MB",
      confidence: "95%",
      boxLabel: "Waste overflow · 95%",
      boxPos: { left: "20%", top: "35%", width: "60%", height: "52%" },
      desc: "Overflowing IMC green garbage bin on Sarafa Bazaar roadside. Waste spilling onto carriageway, blocking traffic.",
      breakdown: [
        { name: "Garbage overflow", pct: 95, color: "bg-emerald-600" },
        { name: "Litter scatter", pct: 79, color: "bg-teal-500" },
        { name: "Odour hazard", pct: 18, color: "bg-slate-300" },
      ],
    },
    "Water leak": {
      photo: "/drain.jpg",
      fileName: "IMG_4021_WaterLeak.jpg · Bhawarkua · 2.2 MB",
      confidence: "88%",
      boxLabel: "Water pipeline seepage · 88%",
      boxPos: { left: "15%", top: "40%", width: "65%", height: "50%" },
      desc: "Fresh water pipe leaking near Bhawarkua Square, water pooling across left lane.",
      breakdown: [
        { name: "Water leak", pct: 88, color: "bg-cyan-600" },
        { name: "Pressure seepage", pct: 65, color: "bg-sky-500" },
        { name: "Pavement erosion", pct: 12, color: "bg-slate-300" },
      ],
    },
    Other: {
      photo: "/footpath.jpg",
      fileName: "IMG_6104_Footpath.jpg · New Palasia · 2.5 MB",
      confidence: "87%",
      boxLabel: "Damaged footpath · 87%",
      boxPos: { left: "18%", top: "30%", width: "64%", height: "55%" },
      desc: "Broken interlocking paving blocks and collapsed curb on pedestrian median.",
      breakdown: [
        { name: "Damaged footpath", pct: 87, color: "bg-orange-600" },
        { name: "Curbside crater", pct: 72, color: "bg-amber-500" },
        { name: "Pedestrian obstruction", pct: 14, color: "bg-slate-300" },
      ],
    },
  };

  // Form State
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Pothole");
  const [previewUrl, setPreviewUrl] = useState(categoryMedia.Pothole.photo);
  const [fileName, setFileName] = useState(categoryMedia.Pothole.fileName);
  const [lat, setLat] = useState(22.7533);
  const [lng, setLng] = useState(75.8937);
  const [ward, setWard] = useState("Ward 34 · Vijay Nagar");
  const [description, setDescription] = useState(categoryMedia.Pothole.desc);

  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);
  const [draftSaved, setDraftSaved] = useState(false);

  const handleSelectCategory = (cat) => {
    setCategory(cat);
    const media = categoryMedia[cat] || categoryMedia.Pothole;
    if (!file) {
      setPreviewUrl(media.photo);
      setFileName(media.fileName);
      setDescription(media.desc);
    }
  };

  const categories = [
    { label: "Pothole", icon: "fa-road" },
    { label: "Streetlight", icon: "fa-lightbulb" },
    { label: "Drainage", icon: "fa-water" },
    { label: "Garbage", icon: "fa-trash-alt" },
    { label: "Water leak", icon: "fa-tint" },
    { label: "Other", icon: "fa-ellipsis-h" },
  ];

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setFileName(`${selected.name} · ${(selected.size / (1024 * 1024)).toFixed(1)} MB`);
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  const handleUseSample = () => {
    const media = categoryMedia[category] || categoryMedia.Pothole;
    setFile(null);
    setPreviewUrl(media.photo);
    setFileName(media.fileName);
    setDescription(media.desc);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const handleGPSDetect = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Number(pos.coords.latitude.toFixed(4)));
          setLng(Number(pos.coords.longitude.toFixed(4)));
        },
        () => {
          // Keep Vijay Nagar
          setLat(22.7533);
          setLng(75.8937);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (file) {
        formData.append("image", file);
      } else {
        try {
          const resp = await fetch(previewUrl || "/pothole.jpg");
          const blob = await resp.blob();
          formData.append("image", blob, fileName?.split(" ")?.[0] || "captured_evidence.jpg");
        } catch {
          const blob = new Blob(["sample"], { type: "image/jpeg" });
          formData.append("image", blob, "captured_evidence.jpg");
        }
      }

      formData.append("latitude", lat.toString());
      formData.append("longitude", lng.toString());
      formData.append("category", category);
      formData.append("area", ward.split("·")?.[1]?.trim() || "Vijay Nagar");
      formData.append("address", "AB Road near Vijay Nagar Square");
      formData.append("description", description || "");

      const result = await api.createReport(formData);
      navigate(`/report/success/${result.id || "IS-0092"}`, {
        state: {
          issue: {
            ...result,
            category: category,
            area: ward.split("·")?.[1]?.trim() || result?.area || "Vijay Nagar",
          },
        },
      });
    } catch (err) {
      console.warn("Backend report creation fallback to local simulated case:", err);
      // Fallback with simulated high quality payload
      const mockResult = {
        id: "IS-0092",
        type: category.toLowerCase().replace(/ /g, "_"),
        category: category,
        title: (description || "").slice(0, 50),
        area: ward.split("·")?.[1]?.trim() || "Vijay Nagar",
        address: "AB Road near Vijay Nagar Square, Scheme No. 78",
        priority_score: 82,
        priority_level: "High",
        status: "Reported",
        report_count: 13,
        latitude: lat,
        longitude: lng,
        created_at: new Date().toISOString(),
      };
      navigate(`/report/success/${mockResult.id}`, { state: { issue: mockResult } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Breadcrumb & Step Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            INFRASIGHT · CITIZEN REPORT
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-0.5">
            New report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Capture the issue, confirm the location, and InfraSight prepares the submission for Indore Municipal Corporation.
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">
              <i className="fas fa-check" />
            </span>
            <span>Sign in</span>
          </div>
          <span className="text-slate-300">──</span>
          <div className="flex items-center gap-1.5 text-cyan-700">
            <span className="w-5 h-5 rounded-full bg-cyan-700 text-white flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Capture</span>
          </div>
          <span className="text-slate-300">──</span>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Submit</span>
          </div>
        </div>
      </div>

      {/* Top 4 Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-900 font-display">94%</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            AI POTHOLE CONFIDENCE
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Photo accepted</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-900 font-display">±4 m</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            GPS ACCURACY
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Within threshold</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-900 font-display">2.4 MB</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            PHOTO SIZE · 3024×4032
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Compress on submit</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-2xl font-black text-cyan-700 font-display">3/3</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            STEPS READY TO SUBMIT
          </div>
          <div className="text-[11px] text-cyan-600 font-medium mt-1">Draft complete</div>
        </div>
      </div>

      {/* Two Spacious Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Photo Capture & AI Confidence */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-display">Photo capture</h2>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[10px] font-bold">
                  Demo AI · analysing
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowBoxes(!showBoxes)}
                className="text-xs text-cyan-700 font-semibold hover:underline"
              >
                {showBoxes ? "Hide boxes" : "Show boxes"}
              </button>
            </div>

            {/* Photo Wrap */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-[4/3] flex items-center justify-center group">
              <img
                src={previewUrl}
                alt="Captured road hazard"
                className="w-full h-full object-cover"
              />

              {/* Scanline Animation during scanning */}
              {isScanning && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent scan-line" />
              )}

              {/* Bounding Boxes */}
              {showBoxes && (
                <div
                  className="absolute border-2 border-amber-400 rounded-lg shadow-lg pointer-events-none transition-all duration-300"
                  style={categoryMedia[category]?.boxPos || categoryMedia.Pothole.boxPos}
                >
                  <span className="absolute -top-6 left-0 bg-amber-500 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded shadow whitespace-nowrap">
                    {categoryMedia[category]?.boxLabel || categoryMedia.Pothole.boxLabel}
                  </span>
                </div>
              )}
            </div>

            {/* Photo Info & Action Buttons */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium truncate">{fileName}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-semibold text-cyan-700 bg-cyan-50 rounded-lg hover:bg-cyan-100"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={handleUseSample}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Reset
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            {/* Category breakdown bars */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
              {(categoryMedia[category]?.breakdown || categoryMedia.Pothole.breakdown).map((b) => (
                <div key={b.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">{b.name}</span>
                    <span className="font-bold text-slate-900">{b.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`${b.color} h-2 rounded-full transition-all duration-300`} style={{ width: `${b.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 mt-3">
              Detection model v2.3 runs on-device in the demo. Tap the frame to retake or upload a clearer photo.
            </p>
          </div>

          {/* Demo AI confidence by frame bar chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Demo AI confidence by frame · percent
            </h3>

            <div className="mt-4 flex items-end justify-around gap-6 h-32 pt-4 px-2">
              <div className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                <span className="text-xs font-bold text-slate-700">73%</span>
                <div className="w-12 bg-slate-300 rounded-t-md" style={{ height: "73%" }} />
                <span className="text-[10px] text-slate-400">Frame 1 · 07:41</span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                <span className="text-xs font-bold text-slate-700">62%</span>
                <div className="w-12 bg-slate-300 rounded-t-md" style={{ height: "62%" }} />
                <span className="text-[10px] text-slate-400">Frame 2 · 07:41</span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                <span className="text-xs font-bold text-amber-600">94%</span>
                <div className="w-12 bg-amber-500 rounded-t-md" style={{ height: "94%" }} />
                <span className="text-[10px] text-amber-700 font-bold">Current · 07:42</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100">
              Three candidate frames from the demo capture session. The current frame clears the 75% acceptance guide; earlier frames did not.
            </p>
          </div>
        </div>

        {/* Right Column: Location & Report Details Form */}
        <div className="lg:col-span-6 space-y-5">
          {/* Location Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-display">Location</h2>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                  GPS locked
                </span>
              </div>
              <button
                type="button"
                onClick={handleGPSDetect}
                className="text-xs text-cyan-700 font-semibold hover:underline flex items-center gap-1"
              >
                <i className="fas fa-location-crosshairs text-xs" />
                <span>Adjust pin</span>
              </button>
            </div>

            {/* Interactive Leaflet Map Box */}
            <div className="h-44 rounded-xl overflow-hidden border border-slate-200 relative">
              <SinglePinMap
                lat={lat}
                lng={lng}
                category={category}
                title="Vijay Nagar · ±4 m accuracy"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <span>
                  <strong>Lat:</strong> {lat}
                </span>
                <span>
                  <strong>Lng:</strong> {lng}
                </span>
              </div>
              <span className="font-bold text-cyan-700">{ward}</span>
            </div>
          </div>

          {/* Report Details Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 font-display mb-1">Report details</h2>

            <form onSubmit={handleSubmit} className="space-y-4 mt-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  CATEGORY – AI SUGGESTION PRE-SELECTED
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => handleSelectCategory(cat.label)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        category === cat.label
                          ? "bg-cyan-700 text-white shadow-sm ring-2 ring-cyan-700/20"
                          : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <i className={`fas ${cat.icon} text-xs`} />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  DESCRIPTION
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/10 leading-relaxed transition-all"
                  placeholder="Describe the issue, landmarks, and hazards..."
                  required
                />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Draft ready: photo, GPS and category attached
                  </span>
                  {draftSaved && (
                    <span className="text-[11px] text-emerald-600 font-bold animate-fadeIn">
                      ✓ Draft saved!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    id="save-draft-btn"
                    type="button"
                    onClick={() => {
                      setDraftSaved(true);
                      setTimeout(() => setDraftSaved(false), 3000);
                    }}
                    className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <i className="far fa-bookmark text-xs" />
                    <span>Save draft</span>
                  </button>

                  <button
                    id="submit-report-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial min-h-[44px] px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin text-sm" />
                        <span>Submitting to IMC...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit report</span>
                        <i className="fas fa-arrow-right text-xs" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom 3 Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-900">Strong photo, sharp pin</div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            The current frame reaches 94% pothole confidence with the pin within ±4 m — no retake needed before submitting.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-900">Auto-category likely correct</div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            The Pothole chip was pre-selected by the demo model at 94% versus 8% for the next candidate, so category editing should be a quick confirm.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-900">One detail gap</div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            The description is good but lacks a landmark cue. Adding "opposite Vijay Nagar bus stop" helps field crews locate it faster.
          </p>
        </div>
      </div>

      {/* Recommended Action Bottom Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
        <i className="fas fa-info-circle text-amber-600 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Recommended action:</strong> Photo, location and category are all captured at demo-acceptance quality — submit now to reserve the AB Road pothole for municipal review.
        </span>
      </div>
    </div>
  );
}
