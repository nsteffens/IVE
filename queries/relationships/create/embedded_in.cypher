MATCH (o:Overlays) WHERE ID(o) = toInt({overlay_id})
MATCH (v:Videos) WHERE ID(v) = toInt({video_id})
CREATE (o)-[r:embedded_in {
    created: timestamp(),
    updated: timestamp(),
    w: {w},
    h: {h},
    d: {d},
    x: {x},
    y: {y},
    z: {z},
    rx: {rx},
    ry: {ry},
    rz: {rz},
    display: {display}
}]->(v)
RETURN
    ID(o) AS overlay_id,
    o.created AS overlay_created,
    o.updated AS overlay_updated,
    o.o_id AS o_id,
    o.name AS overlay_name,
    o.description AS overlay_description,
    o.category AS overlay_category,
    o.url AS overlay_url,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    r.w AS relationship_w,
    r.h AS relationship_h,
    r.d AS relationship_d,
    r.x AS relationship_x,
    r.y AS relationship_y,
    r.z AS relationship_z,
    r.rx AS relationship_rx,
    r.ry AS relationship_ry,
    r.rz AS relationship_rz,
    r.display AS relationship_display,
    ID(v) AS video_id,
    v.created AS video_created,
    v.updated AS video_updated,
    v.v_id AS v_id,
    v.name AS video_name,
    v.description AS video_description,
    v.url AS video_url,
    v.recorded AS video_recorded
;
