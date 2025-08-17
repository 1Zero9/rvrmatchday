import { useState } from "react";

export default function AdminEdit() {
  const [content, setContent] = useState("Welcome to our club website!");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Editor</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-3 rounded mb-4"
        rows={6}
      />
      <div className="border p-4 rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Preview</h2>
        <p>{content}</p>
      </div>
    </div>
  );
}
