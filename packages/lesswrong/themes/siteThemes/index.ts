import { ForumTypeString } from '../../lib/instanceSettings';
import { alignmentForumTheme } from './alignmentForumTheme'
import { eaForumTheme } from './eaTheme'
import { lessWrongTheme } from './lesswrongTheme'
import { personalTheme } from './personalTheme'

export const getSiteTheme = (forumType: ForumTypeString): SiteThemeSpecification => {
  switch (forumType) {
    case 'AlignmentForum': return alignmentForumTheme;
    case 'EAForum': return eaForumTheme;
    case "LessWrong": return lessWrongTheme;
    case 'Personal': return personalTheme;
    default: return lessWrongTheme;
  }
}
