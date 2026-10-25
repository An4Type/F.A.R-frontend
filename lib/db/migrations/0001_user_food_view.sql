-- The user's food list: catalog foods with the user's overrides applied, plus
-- the user's own foods and recipes. Names use the translation for the user's
-- locale when there is one.
CREATE VIEW `v_user_food` AS
SELECT
    f.id AS food_id,
    uf.id AS user_food_id,
    COALESCE(uf.name, ft.name, f.name) AS name,
    COALESCE(uf.category_id, f.category_id) AS category_id,
    COALESCE(uf.kcal_per_100g, f.kcal_per_100g) AS kcal_per_100g,
    COALESCE(uf.fat_g_per_100g, f.fat_g_per_100g) AS fat_g_per_100g,
    COALESCE(uf.carbs_g_per_100g, f.carbs_g_per_100g) AS carbs_g_per_100g,
    COALESCE(uf.protein_g_per_100g, f.protein_g_per_100g) AS protein_g_per_100g,
    uf.id IS NOT NULL AS is_overridden,
    0 AS is_recipe
FROM food f
LEFT JOIN food_translation ft
    ON ft.food_id = f.id AND ft.locale = (SELECT locale FROM user_preferences LIMIT 1)
LEFT JOIN user_food uf
    ON uf.base_food_id = f.id AND uf.deleted_at IS NULL
WHERE f.is_active = 1

UNION ALL

SELECT
    NULL,
    uf.id,
    uf.name,
    uf.category_id,
    uf.kcal_per_100g,
    uf.fat_g_per_100g,
    uf.carbs_g_per_100g,
    uf.protein_g_per_100g,
    0,
    uf.is_recipe
FROM user_food uf
WHERE uf.base_food_id IS NULL AND uf.deleted_at IS NULL;
