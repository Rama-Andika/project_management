<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('project_statuses')->insert([
            ['project_name_id'=>1, 'status' => 'In Progress', 'sequence' => 1],
            ['project_name_id'=>1, 'status' => 'Sent', 'sequence' => 2],
            ['project_name_id'=>2, 'status' => 'In Progress', 'sequence' => 1],
            ['project_name_id'=>2, 'status' => 'Done', 'sequence' => 2],
        ]);
    }
}
