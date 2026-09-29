// Categories moved into the library so IconPicker can group by them too; re-exported
// here because the catalog page and its imports were already written against this path.
export {
    type IconCategory,
    iconCategoryById,
    iconCategoryByPath,
    iconCategoryDefinitions,
    OTHER_CATEGORY_ID,
    otherCategory,
} from '../../../src/components/Icon/iconCategories';
