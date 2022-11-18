<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("project_id");
            $table->unsignedBigInteger("project_name_id");
            $table->integer("sequence");
            $table->unsignedBigInteger("project_status_id");
            $table->string("document_attch");
            $table->text("project_note");
            $table->timestamps();


            //relationship projects
            $table->foreign('project_id')->references('id')->on('projects');

            //relationship project_names
            $table->foreign('project_name_id')->references('id')->on('project_names');

            //relationship project_stasuses
            $table->foreign('project_status_id')->references('id')->on('project_statuses');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('project_details');
    }
}
