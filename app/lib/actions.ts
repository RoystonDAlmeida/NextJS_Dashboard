'use server'; // By adding the 'use server', you mark all the exported functions within the file as Server Actions. These server functions can then be imported and used in Client and Server components.

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';    // 6. Revalidate and redirect Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time. Along with prefetching, this cache ensures that users can quickly navigate between routes while reducing the number of requests made to the server. Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. You can do this with the revalidatePath function from Next.js:
// To handle type validation, you have a few options. While you can manually validate types, using a type validation library can save you time and effort. For your example, we'll use Zod, a TypeScript-first validation library that can simplify this task for you.

// In your actions.ts file, import Zod and define a schema that matches the shape of your form object. This schema will validate the formData before saving it to a database.
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),    // change from text to number
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
    
    const amountInCents = amount * 100; // Storing monetary values in cents to ensure greater accuracy
    const date = new Date().toISOString().split('T')[0];    // Finally, let's create a new date with the format "YYYY-MM-DD" for the invoice's creation date:
    
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
// ...
 
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');      // Since this action is being called in the /dashboard/invoices path, you don't need to call redirect. Calling revalidatePath will trigger a new server request and re-render the table.
  }