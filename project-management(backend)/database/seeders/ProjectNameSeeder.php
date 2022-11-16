<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectNameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('project_names')->insert([
            ['name'=>'Quotation', 'sequence' => 1, 'required_file'=>1],
            ['name'=>'PO', 'sequence' => 2, 'required_file'=>1],
            ['name'=>'PERSIAPAN BARANG', 'sequence' => 3, 'required_file'=>1],
            ['name'=>'PEMBAYARAN / DP', 'sequence' => 4, 'required_file'=>1],
            ['name'=>'PENGIRIMAN', 'sequence' => 5, 'required_file'=>1],
            ['name'=>'PELUNASAN', 'sequence' => 6, 'required_file'=>1],
        ]);
    }
}
