import React, { useEffect, useMemo, useState } from "react";
import SimpleModal from "./SimpleModal";

const normalizeResp = (res) => (res?.items ?? res ?? []);

const LinkModal = ({
  isOpen,
  onClose,
  uniqueId,
  searchAssets,
  listAllAssets,
  listByIdAssets,
  addAsset,
  removeAsset,
  match_id_name = "id",
}) => {
  const [loading, setLoading] = useState(false);
  const [allAssets, setAllAssets] = useState([]);
  const [linkedAssets, setLinkedAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [inFlightIds, setInFlightIds] = useState(new Set());
  const [localLinkedIds, setLocalLinkedIds] = useState(new Set());

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      setLoading(true);
      try {
        const [allRes, linkedRes] = await Promise.all([
          listAllAssets ? listAllAssets() : Promise.resolve([]),
          listByIdAssets && uniqueId ? listByIdAssets(uniqueId) : Promise.resolve([]),
        ]);
        const all = normalizeResp(allRes);
        const linked = normalizeResp(linkedRes);
        setAllAssets(all);
        setLinkedAssets(linked);
        setSearchResults([]);
        setSearchTerm("");
        // initialize local linked id set for optimistic updates
        const ids = new Set((linked || []).map((a) => String(a[match_id_name] ?? a.id)));
        setLocalLinkedIds(ids);
      } catch (e) {
        console.error("LinkModal load", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen, uniqueId, listAllAssets, listByIdAssets, match_id_name]);

  const idFor = (a) => String(a[match_id_name] ?? a.id ?? "");
  const nameFor = (a) => a.name ?? idFor(a);

  // Build a merged, deduped list: linked items first (preserve linked order), then the rest
  const mergedList = useMemo(() => {
    const map = new Map();
    // add linked first in their order
    (
      linkedAssets || []).forEach((a) => {
      const id = idFor(a);
      map.set(id, { ...a, id, name: nameFor(a), __isLinked: true });
    });
    // then add all assets if not present
    (allAssets || []).forEach((a) => {
      const id = idFor(a);
      if (!map.has(id)) {
        map.set(id, { ...a, id, name: nameFor(a), __isLinked: localLinkedIds.has(id) });
      } else {
        // ensure __isLinked reflects localLinkedIds (optimistic updates)
        // and preserve a proper name coming from allAssets when linked entry only had an id
        const existing = map.get(id);
        existing.__isLinked = localLinkedIds.has(id) || existing.__isLinked;
        // prefer the name from the full asset (a) if existing.name is missing or equals the id
        const existingName = existing.name ?? "";
        const incomingName = nameFor(a) ?? "";
        if (!existingName || existingName === existing.id || existingName === String(existing.id)) {
          existing.name = incomingName || existingName;
        }
        map.set(id, existing);
      }
    });
    return Array.from(map.values());
  }, [allAssets, linkedAssets, localLinkedIds]);

  const performSearch = async (q) => {
    if (!q) {
      setSearchResults([]);
      return;
    }
    if (searchAssets) {
      try {
        const res = await searchAssets(q);
        setSearchResults(normalizeResp(res));
      } catch (e) {
        console.error("search error", e);
        setSearchResults([]);
      }
    } else {
      const ql = q.toLowerCase();
      setSearchResults((allAssets || []).filter((a) => (nameFor(a) || "").toLowerCase().includes(ql) || idFor(a).toLowerCase().includes(ql)));
    }
  };

  const isIdLinked = (id) => localLinkedIds.has(String(id));

  const setInFlight = (id, v) => {
    setInFlightIds((prev) => {
      const s = new Set(prev);
      if (v) s.add(String(id));
      else s.delete(String(id));
      return s;
    });
  };

  const optimisticAdd = (id) => {
    setLocalLinkedIds((prev) => new Set([...Array.from(prev), String(id)]));
  };

  const optimisticRemove = (id) => {
    setLocalLinkedIds((prev) => {
      const s = new Set(prev);
      s.delete(String(id));
      return s;
    });
  };

  const handleAddClick = async (asset) => {
    const id = idFor(asset);
    if (!addAsset || inFlightIds.has(id) || isIdLinked(id)) return;
    setInFlight(id, true);
    optimisticAdd(id);
    try {
      await addAsset(uniqueId, id);
    } catch (e) {
      console.error("addAsset failed", e);
      // rollback
      optimisticRemove(id);
    } finally {
      setInFlight(id, false);
    }
  };

  const handleRemoveClick = async (asset) => {
    const id = idFor(asset);
    if (!removeAsset || inFlightIds.has(id) || !isIdLinked(id)) return;
    setInFlight(id, true);
    // optimistic remove
    optimisticRemove(id);
    try {
      await removeAsset(uniqueId, id);
    } catch (e) {
      console.error("removeAsset failed", e);
      // rollback
      optimisticAdd(id);
    } finally {
      setInFlight(id, false);
    }
  };

  const filtered = useMemo(() => {
    if (searchTerm) return searchResults;
    return mergedList;
  }, [searchTerm, searchResults, mergedList]);

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose} title={`Manage Links`}>
      <div className="space-y-4">
        {loading && <div className="text-sm">Loading...</div>}

        <div className="grid grid-cols-1 gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                const v = e.target.value;
                setSearchTerm(v);
                performSearch(v);
              }}
              placeholder="Search assets..."
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Assets</h3>
          <div className="max-h-56 overflow-auto border rounded p-2">
            {filtered.length === 0 ? (
              <div className="text-sm text-gray-500">No assets found.</div>
            ) : (
              filtered.map((a) => {
                const idVal = a.id ?? idFor(a);
                const displayName = nameFor(a);
                const linked = isIdLinked(idVal);
                const inFlight = inFlightIds.has(String(idVal));
                return (
                  <div key={String(idVal)} className={`flex items-center justify-between p-2 ${linked ? "bg-green-50" : ""}`}>
                    <div className="text-sm">{displayName}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">{linked ? "Linked" : "Not linked"}</div>
                      {linked ? (
                        <button
                          onClick={() => handleRemoveClick(a)}
                          disabled={inFlight}
                          className={`px-2 py-1 rounded border ${inFlight ? "opacity-60" : "bg-red-50"}`}
                        >
                          🗑
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddClick(a)}
                          disabled={inFlight}
                          className={`px-2 py-1 rounded border ${inFlight ? "opacity-60" : "bg-green-50"}`}
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Close
          </button>
        </div>
      </div>
    </SimpleModal>
  );
};

export default LinkModal;
