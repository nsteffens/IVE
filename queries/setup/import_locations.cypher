// Add locations
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///locations.csv' AS line FIELDTERMINATOR ','
CREATE (location:Locations {
    l_id: line.`l_id`,
    name: line.`name`,
    description: line.`description`,
    lat: toFloat(line.`lat`),
    lng: toFloat(line.`lng`),
    location_type: line.`location_type`,
    created: timestamp(),
    updated: timestamp()
})
WITH line, location
MATCH (scenario:Scenarios) WHERE scenario.s_id = line.`s_id`
CREATE (location)-[:belongs_to {
    created: timestamp(),
    updated: timestamp()
}]->(scenario);
