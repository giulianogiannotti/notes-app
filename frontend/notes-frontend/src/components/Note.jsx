import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import ArchiveButton from "./ArchiveButton";

function Note({ id, title, content, isArchived, categories }) {
  return (
    <div class="w-full mt-4 mr-4 ml-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div class="flex flex-col items-center pb-10 px-4 pt-6">
        <div class="flex items-center mb-2 w-full justify-between">
          <h5 class="ml-3 mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {title}
          </h5>
          {!isArchived && (
            <span class="mr-3 bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
              Active
            </span>
          )}
          {isArchived && (
            <span class="mr-3 bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
              Done
            </span>
          )}
        </div>
        <span class="text-sm text-gray-500 dark:text-gray-400">{content}</span>
        <div class="flex mt-4 md:mt-6">
          <EditButton
            id={id}
            title={title}
            content={content}
            isArchived={isArchived}
          ></EditButton>
          <ArchiveButton id={id} isArchived={isArchived}></ArchiveButton>
          <DeleteButton id={id}></DeleteButton>
        </div>
      </div>
    </div>
  );
}

export default Note;
