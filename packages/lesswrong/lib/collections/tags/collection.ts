import { createCollection, Utils } from '../../vulcan-lib';
import { addUniversalFields, getDefaultResolvers, getDefaultMutations, schemaDefaultValue } from '../../collectionUtils'
import { denormalizedCountOfReferences } from '../../utils/schemaUtils';
import { makeEditable } from '../../editor/make_editable'
import Users from '../users/collection';

const formGroups = {
  advancedOptions: {
    name: "advancedOptions",
    order: 20,
    label: "Advanced Options",
    startCollapsed: true,
  },
};

const schema = {
  name: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['admins', 'sunshineRegiment'],
    editableBy: ['admins'],
  },
  slug: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    onInsert: (tag) => {
      return Utils.getUnusedSlugByCollectionName("Tags", Utils.slugify(tag.name))
    },
    onEdit: (modifier, tag) => {
      if (modifier.$set.name) {
        return Utils.getUnusedSlugByCollectionName("Tags", Utils.slugify(modifier.$set.name), false, tag._id)
      }
    }
  },
  postCount: {
    ...denormalizedCountOfReferences({
      fieldName: "postCount",
      collectionName: "Tags",
      foreignCollectionName: "TagRels",
      foreignTypeName: "TagRel",
      foreignFieldName: "tagId",
      //filterFn: tagRel => tagRel.baseScore > 0, //TODO: Didn't work with filter; votes are bypassing the relevant callback?
    }),
    viewableBy: ['guests'],
  },
  deleted: {
    type: Boolean,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    optional: true,
    group: formGroups.advancedOptions,
    ...schemaDefaultValue(false),
  },
};

interface ExtendedTagsCollection extends TagsCollection {
  // From search/utils.ts
  toAlgolia: any
}

export const Tags: ExtendedTagsCollection = createCollection({
  collectionName: 'Tags',
  typeName: 'Tag',
  schema,
  resolvers: getDefaultResolvers('Tags'),
  mutations: getDefaultMutations('Tags', {
    newCheck: (user, tag) => {
      return Users.isAdmin(user);
    },
    editCheck: (user, tag) => {
      return Users.isAdmin(user);
    },
    removeCheck: (user, tag) => {
      return false;
    },
  }),
});

Tags.checkAccess = (currentUser, tag) => {
  if (Users.isAdmin(currentUser))
    return true;
  else if (tag.deleted)
    return false;
  else
    return true;
}

addUniversalFields({collection: Tags})

export const tagDescriptionEditableOptions = {
  fieldName: "description",
  getLocalStorageId: (tag, name) => {
    if (tag._id) { return {id: `tag:${tag._id}`, verify:true} }
    return {id: `tag:create`, verify:true}
  },
};

makeEditable({
  collection: Tags,
  options: tagDescriptionEditableOptions,
});

export default Tags;