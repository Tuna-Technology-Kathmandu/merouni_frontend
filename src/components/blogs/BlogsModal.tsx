

// const BlogsModal = ()=>{
//     return (

//         <Modal
//           isOpen={isOpen}
//           onClose={() => {
//             setIsOpen(false)
//             setEditing(false)
//             setEditingId(null)
//             reset()
//             setSelectedTags([])
//             setUploadedFiles({ featuredImage: '' })
//           }}
//           title={editing ? 'Edit Blog' : 'Add Blog'}
//           className='max-w-5xl'
//         >
//           <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
//             <form
//               onSubmit={handleSubmit(onSubmit)}
//               className='flex flex-col flex-1 overflow-hidden'
//             >
//               <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
//                 {/* Basic Information */}
//                 <div className='bg-white p-6 rounded-lg shadow-md'>
//                   <h2 className='text-xl font-semibold mb-4'>
//                     Blog Information
//                   </h2>
//                   <div className='space-y-4'>
//                     <div>
//                       <RequiredLabel htmlFor='title'>Blog Title</RequiredLabel>
//                       <Input
//                         id='title'
//                         placeholder='Blog Title'
//                         {...register('title', {
//                           required: 'Title is required'
//                         })}
//                         aria-invalid={errors.title ? 'true' : 'false'}
//                       />
//                       {errors.title && (
//                         <p className='text-sm font-medium text-destructive mt-1'>
//                           {errors.title.message}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <RequiredLabel htmlFor='category'>Category</RequiredLabel>
//                       <select
//                         id='category'
//                         {...register('category', {
//                           required: 'Category is required'
//                         })}
//                         className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
//                       >
//                         <option value=''>Select Category</option>
//                         {categories.map((cat) => (
//                           <option key={cat.id} value={cat.id}>
//                             {cat.title}
//                           </option>
//                         ))}
//                       </select>
//                       {errors.category && (
//                         <p className='text-sm font-medium text-destructive mt-1'>
//                           {errors.category.message}
//                         </p>
//                       )}
//                     </div>

//                     {/* Tags search input */}
//                     <div className='relative'>
//                       <Input
//                         type='text'
//                         placeholder='Search for tags...'
//                         value={tagsSearch}
//                         onChange={handleTagsSearch}
//                       />

//                       {/* Display search results in a dropdown */}
//                       {searchResults.length > 0 && (
//                         <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto'>
//                           {searchResults.map((tag) => (
//                             <div
//                               key={tag.id}
//                               className='p-2 hover:bg-gray-100 cursor-pointer'
//                               onClick={() => handleSelectTag(tag)}
//                             >
//                               {tag.title}
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* Display selected tags */}
//                       <div className='mt-2 flex flex-wrap gap-2'>
//                         {selectedTags.map((tag) => (
//                           <span
//                             key={tag.id}
//                             className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1'
//                           >
//                             {tag.title}
//                             <button
//                               type='button'
//                               onClick={() => {
//                                 const newTags = selectedTags.filter(
//                                   (t) => t.id !== tag.id
//                                 )
//                                 setSelectedTags(newTags)
//                                 setValue(
//                                   'tags',
//                                   newTags.map((t) => t.id)
//                                 )
//                               }}
//                               className='text-blue-600 hover:text-blue-800 ml-1'
//                             >
//                               ×
//                             </button>
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Description and Content */}
//                 <div className='bg-white p-6 rounded-lg shadow-md'>
//                   <h2 className='text-xl font-semibold mb-4'>
//                     Description & Content
//                   </h2>
//                   <div className='space-y-4'>
//                     <div>
//                       <Label htmlFor='description'>Description</Label>
//                       <textarea
//                         id='description'
//                         placeholder='Description'
//                         {...register('description')}
//                         className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
//                         rows='4'
//                       />
//                     </div>

//                     <div>
//                       <label htmlFor='content' className='block mb-2'>
//                         Content
//                       </label>
//                       <CKBlogs
//                         initialData={getValues('content')}
//                         onChange={(data) => setValue('content', data)}
//                         id='editor1'
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Media */}
//                 <div className='bg-white p-6 rounded-lg shadow-md'>
//                   <h2 className='text-xl font-semibold mb-4'>Featured Image </h2>
//                   <FileUpload
//                     label='Blog Image'
//                     onUploadComplete={(url) => {
//                       setUploadedFiles((prev) => ({
//                         ...prev,
//                         featuredImage: url
//                       }))
//                     }}
//                     defaultPreview={uploadedFiles.featuredImage}
//                   />
//                 </div>

//                 {/* Additional Settings */}
//                 <div className='bg-white p-6 rounded-lg shadow-md'>
//                   <h2 className='text-xl font-semibold mb-4'>
//                     Additional Settings
//                   </h2>
//                   <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                     <div>
//                       <Label htmlFor='visibility'>Visibility</Label>
//                       <select
//                         id='visibility'
//                         {...register('visibility')}
//                         className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
//                       >
//                         <option value='private'>Private</option>
//                         <option value='public'>Public</option>
//                       </select>
//                     </div>

//                     <div>
//                       <Label htmlFor='status'>Status</Label>
//                       <select
//                         id='status'
//                         {...register('status')}
//                         className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
//                       >
//                         <option value='draft'>Draft</option>
//                         <option value='published'>Published</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Submit Button - Sticky Footer */}
//               <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end'>
//                 <Button
//                   type='submit'
//                   className=' text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300'
//                   disabled={submitting}
//                 >
//                   {submitting
//                     ? editing
//                       ? 'Updating...'
//                       : 'Adding...'
//                     : editing
//                       ? 'Update Blog'
//                       : 'Create Blog'}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </Modal>

//     )
// }